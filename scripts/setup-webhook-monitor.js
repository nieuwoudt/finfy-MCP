#!/usr/bin/env node

/**
 * Script to set up webhook monitoring
 * This script creates the necessary database tables for webhook monitoring
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase connection details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials. Please check your .env.local file.');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupWebhookMonitor() {
  console.log('📊 Setting up webhook monitoring...');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema-webhook-monitor.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      console.log(`Executing: ${statement.substring(0, 50)}...`);
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });
      
      if (error) {
        console.error(`❌ Error executing SQL: ${error.message}`);
        console.error(`Statement: ${statement}`);
      }
    }

    console.log('✅ Webhook monitoring setup complete!');
    
    // Verify the table was created
    const { data, error } = await supabase
      .from('webhook_events')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error(`❌ Error verifying webhook_events table: ${error.message}`);
    } else {
      console.log('✅ Webhook events table verified!');
    }

  } catch (error) {
    console.error('❌ Error setting up webhook monitoring:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupWebhookMonitor(); 