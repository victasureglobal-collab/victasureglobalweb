import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfoipydmnwllbxaneaeo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb2lweWRtbndsbGJ4YW5lYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNjM4MTAsImV4cCI6MjA5NzYzOTgxMH0.l2qi9v_xSW92uKRXqlZ3hDd0XtaapYOgssz73Gvr1aI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanSettings() {
  console.log("Fetching current settings from Supabase...");
  const { data, error } = await supabase.from('website_settings').select('*').single();
  if (error) {
    console.error("Error fetching settings:", error);
    return;
  }

  console.log("Existing columns:", Object.keys(data));
  console.log("Replacing hero_banner_url with a clean unsplash link...");
  
  const cleanPayload = {
    id: data.id,
    hero_banner_url: JSON.stringify([
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1600"
    ])
  };

  console.log("Updating Supabase website_settings...");
  const { data: result, error: updateError } = await supabase
    .from('website_settings')
    .update(cleanPayload)
    .eq('id', 'main')
    .select();

  if (updateError) {
    console.error("Error updating settings:", updateError);
  } else {
    console.log("Supabase website_settings successfully cleaned and optimized!", result);
  }
}

cleanSettings();
