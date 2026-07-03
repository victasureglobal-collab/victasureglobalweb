import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sfoipydmnwllbxaneaeo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNmb2lweWRtbndsbGJ4YW5lYWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwNjM4MTAsImV4cCI6MjA5NzYzOTgxMH0.l2qi9v_xSW92uKRXqlZ3hDd0XtaapYOgssz73Gvr1aI';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  console.log("Querying Supabase categories table...");
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('categories').select('*').limit(1);
    if (error) throw error;
    console.log(`Success! Fetched in ${Date.now() - start}ms. Data:`, data);
  } catch (err) {
    console.error(`Failed after ${Date.now() - start}ms:`, err);
  }
}

test();
