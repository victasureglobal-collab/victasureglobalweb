import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Read env variables
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const url = lines[0].split('=')[1].trim();
const key = lines[1].split('=')[1].trim();

const supabase = createClient(url, key);

async function testInsert() {
  const testPayload = {
    id: 'enq-test-' + Date.now().toString(36),
    name: 'Test Customer',
    email: 'test@company.com',
    country: 'Germany',
    phone: '+49 170 1234567',
    state: 'Bavaria',
    pincode: '80331',
    product_interested: '6 inch Plates',
    product_code: 'VS-101',
    message: 'Test message for B2B enquiry',
    destination_port: 'Port of Hamburg',
    preferred_incoterm: 'FOB',
    status: 'new',
    created_at: new Date().toISOString()
  };

  try {
    console.log("Attempting insert payload:", testPayload);
    const { data, error } = await supabase.from('enquiries').insert(testPayload).select().single();
    if (error) {
      console.error("ERROR from Supabase:", error);
    } else {
      console.log("SUCCESS! Row inserted successfully:", data);
    }
  } catch (e) {
    console.error("Caught error:", e.message || e);
  }
}

testInsert();
