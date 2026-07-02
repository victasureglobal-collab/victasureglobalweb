import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfoipydmnwllbxaneaeo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb2lweWRtbndsbGJ4YW5lYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNjM4MTAsImV4cCI6MjA5NzYzOTgxMH0.l2qi9v_xSW92uKRXqlZ3hDd0XtaapYOgssz73Gvr1aI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const uploadFile = async (fileBase64, folder = 'migrated') => {
  try {
    if (!fileBase64 || typeof fileBase64 !== 'string' || !fileBase64.startsWith('data:')) {
      return fileBase64;
    }
    const match = fileBase64.match(/^data:(.+?);base64,(.+)$/);
    if (!match) return fileBase64;
    
    const contentType = match[1];
    const base64Data = match[2];
    
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });

    const extension = contentType.split('/')[1] || 'bin';
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${extension}`;

    const { error } = await supabase.storage
      .from('website_assets')
      .upload(fileName, blob, {
        contentType: contentType,
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('website_assets')
      .getPublicUrl(fileName);

    console.log(`Uploaded file to: ${urlData.publicUrl}`);
    return urlData.publicUrl;
  } catch (err) {
    console.error("Storage upload failed:", err);
    return fileBase64;
  }
};

async function migrateData() {
  console.log("=== STARTING CATALOGUES MIGRATION ===");

  // Migrate Catalogues
  console.log("\n1. Migrating catalogues table...");
  const { data: catalogues, error: cError } = await supabase.from('catalogues').select('*');
  if (cError) {
    console.error("Failed to fetch catalogues:", cError);
  } else {
    for (const c of catalogues) {
      if (c.pdf_url && c.pdf_url.startsWith('data:')) {
        console.log(`Migrating catalogue PDF for: ${c.product_name || c.id}`);
        const url = await uploadFile(c.pdf_url, 'catalogues');
        const { error: updateErr } = await supabase
          .from('catalogues')
          .update({ pdf_url: url })
          .eq('id', c.id);
        if (updateErr) {
          console.error(`Error updating catalogue ${c.id}:`, updateErr);
        } else {
          console.log(`Successfully migrated catalogue PDF: ${c.product_name || c.id}`);
        }
      }
    }
  }

  console.log("\n=== CATALOGUES MIGRATION COMPLETE ===");
}

migrateData();
