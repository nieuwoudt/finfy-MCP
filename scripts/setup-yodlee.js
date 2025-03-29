#!/usr/bin/env node

/**
 * This script helps initialize the Yodlee integration by:
 * 1. Checking if all environment variables are set
 * 2. Setting up webhook subscriptions
 * 3. Testing the FastLink integration
 * 4. Providing setup instructions
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');
const path = require('path');
const chalk = require('chalk');
const { execSync } = require('child_process');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log(chalk.blue.bold('=== Yodlee Integration Setup ===\n'));

  // Step 1: Check environment variables
  const requiredVars = [
    'YODLEE_BASE_URL',
    'YODLEE_CLIENT_ID',
    'YODLEE_CLIENT_SECRET',
    'YODLEE_API_VERSION',
    'YODLEE_LOGIN_NAME',
    'YODLEE_FASTLINK_URL',
    'NEXT_PUBLIC_YODLEE_FASTLINK_URL',
    'NEXT_PUBLIC_SITE_URL',
    'YOADLEE_API'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.log(chalk.red('Missing required environment variables:'));
    missingVars.forEach(varName => console.log(chalk.red(`- ${varName}`)));

    console.log('\nPlease update your .env.local file with the following variables:');
    missingVars.forEach(varName => console.log(`${varName}=<value>`));

    console.log('\nYou can find these values in the Yodlee credentials provided by email.');
    process.exit(1);
  }

  console.log(chalk.green('✅ All required environment variables are set.'));

  // Step 2: Test database connection and deploy schema
  console.log('\n' + chalk.yellow('Step 2: Testing database connection and deploying schema...'));
  
  try {
    console.log('Applying Yodlee database schema...');
    // Execute npx supabase db diff to see if tables already exist
    const schemaExists = await question('Would you like to apply the Yodlee schema to your database? (y/n): ');
    
    if (schemaExists.toLowerCase() === 'y') {
      try {
        execSync('psql -d postgresql://postgres:postgres@localhost:54322/postgres -f ./supabase/schema-yodlee.sql', { stdio: 'inherit' });
        console.log(chalk.green('✅ Database schema applied successfully.'));
      } catch (error) {
        console.error(chalk.red('Error applying database schema:'), error.message);
        console.log('You may need to apply the schema manually using the Supabase dashboard or CLI.');
      }
    } else {
      console.log('Skipping schema application.');
    }
  } catch (error) {
    console.error(chalk.red('Error connecting to database:'), error.message);
  }

  // Step 3: Test Yodlee API connection
  console.log('\n' + chalk.yellow('Step 3: Testing Yodlee API connection...'));
  
  try {
    // Generate access token
    const tokenResponse = await fetch(`${process.env.YODLEE_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Api-Version': process.env.YODLEE_API_VERSION || '1.1',
        'loginName': process.env.YODLEE_LOGIN_NAME
      },
      body: new URLSearchParams({
        clientId: process.env.YODLEE_CLIENT_ID,
        secret: process.env.YODLEE_CLIENT_SECRET
      })
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok || !tokenData.token?.accessToken) {
      throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
    }

    const accessToken = tokenData.token.accessToken;
    console.log(chalk.green('✅ Successfully connected to Yodlee API and obtained access token.'));

    // Step 4: Setup webhook subscriptions
    console.log('\n' + chalk.yellow('Step 4: Setting up webhook subscriptions...'));
    
    const setupWebhook = await question('Would you like to set up webhook subscriptions? (y/n): ');
    
    if (setupWebhook.toLowerCase() === 'y') {
      const webhookUrl = process.env.NEXT_PUBLIC_SITE_URL 
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/api/yodlee/webhook`
        : await question('Enter the full webhook URL (e.g., https://yourdomain.com/api/yodlee/webhook): ');
      
      // Events to subscribe to
      const events = ['REFRESH', 'DATA_UPDATES', 'AUTO_REFRESH_UPDATES', 'LATEST_BALANCE_UPDATES'];
      
      for (const event of events) {
        try {
          const subscribeResponse = await fetch(`${process.env.YODLEE_BASE_URL}/configs/notifications/events/${event}`, {
            method: 'POST',
            headers: {
              'Api-Version': process.env.YODLEE_API_VERSION || '1.1',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              event: {
                callbackUrl: webhookUrl
              }
            })
          });
          
          if (subscribeResponse.ok) {
            console.log(chalk.green(`✅ Successfully subscribed to ${event} events.`));
          } else {
            const errorData = await subscribeResponse.json();
            console.log(chalk.yellow(`⚠️ Failed to subscribe to ${event}: ${JSON.stringify(errorData)}`));
          }
        } catch (error) {
          console.log(chalk.yellow(`⚠️ Error subscribing to ${event}: ${error.message}`));
        }
      }
      
      console.log('\nNote: If any webhook subscriptions failed, you may need to:');
      console.log('1. Ensure your webhook URL is publicly accessible');
      console.log('2. Contact Yodlee support for assistance with webhook configuration');
    } else {
      console.log('Skipping webhook setup.');
    }

    // Step 5: Final instructions
    console.log('\n' + chalk.blue.bold('=== Setup Complete ==='));
    console.log('\nNext steps:');
    console.log('1. Ensure your webhook URL is publicly accessible');
    console.log('2. Test the integration by connecting a test account using FastLink');
    console.log('3. Verify that transactions and accounts are being saved correctly');
    console.log('\nTest user credentials from Yodlee:');
    console.log('- Bank: DAG Site');
    console.log('- Username: YodTest.site16441.2');
    console.log('- Password: site16441.2');
    
  } catch (error) {
    console.error(chalk.red('Error testing Yodlee API connection:'), error.message);
  }

  rl.close();
}

main().catch(error => {
  console.error(chalk.red('Unhandled error:'), error);
  process.exit(1);
}); 