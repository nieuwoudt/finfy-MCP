// deploy-staging.js
const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  console.log(chalk.blue(`Loading environment variables from ${envPath}`));
  dotenv.config({ path: envPath });
} else {
  console.log(chalk.yellow('.env.local file not found. Using existing environment variables.'));
}

console.log(chalk.blue('Starting staging deployment to Vercel...'));

// Use locally installed vercel instead of global
const vercelCommand = path.resolve(process.cwd(), 'node_modules/.bin/vercel');

// Check if vercel is installed locally
if (!fs.existsSync(vercelCommand)) {
  console.log(chalk.yellow('Vercel CLI not found locally. Please run: npm install --save-dev vercel'));
  process.exit(1);
}

// Login to Vercel if needed (using local vercel)
try {
  console.log(chalk.blue('Checking Vercel authentication...'));
  execSync(`${vercelCommand} whoami`, { stdio: 'pipe' });
  console.log(chalk.green('Already logged in to Vercel.'));
} catch (error) {
  console.log(chalk.yellow('Not logged in to Vercel. Starting login process...'));
  execSync(`${vercelCommand} login`, { stdio: 'inherit' });
}

// Deploy to Vercel with staging environment variables
try {
  console.log(chalk.blue('Deploying to Vercel staging environment...'));
  
  // Build the list of environment variables to pass to Vercel
  const envVars = [
    // Supabase
    `-e NEXT_PUBLIC_SUPABASE_URL=${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}`,
    `-e NEXT_PUBLIC_SUPABASE_ANON_KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
    
    // Plaid
    `-e PLAID_CLIENT_ID=${process.env.PLAID_CLIENT_ID || ''}`,
    `-e PLAID_SECRET=${process.env.PLAID_SECRET || ''}`,
    `-e PLAID_ENV=${process.env.PLAID_ENV || 'sandbox'}`,
    
    // Yodlee
    `-e YODLEE_BASE_URL=${process.env.YODLEE_BASE_URL || 'https://fingoalchannel.stageapi.yodlee.com/ysl'}`,
    `-e YODLEE_CLIENT_ID=${process.env.YODLEE_CLIENT_ID || ''}`,
    `-e YODLEE_CLIENT_SECRET=${process.env.YODLEE_CLIENT_SECRET || ''}`,
    `-e YODLEE_API_VERSION=${process.env.YODLEE_API_VERSION || '1.1'}`,
    `-e YODLEE_LOGIN_NAME=${process.env.YODLEE_LOGIN_NAME || ''}`,
    `-e YODLEE_FASTLINK_URL=${process.env.YODLEE_FASTLINK_URL || 'https://finapp.fingoalchannelstage.yodlee.com/authenticate/finfy-development/fastlink?channelAppName=fingoalchannel'}`,
    `-e NEXT_PUBLIC_YODLEE_FASTLINK_URL=${process.env.NEXT_PUBLIC_YODLEE_FASTLINK_URL || 'https://finapp.fingoalchannelstage.yodlee.com/authenticate/finfy-development/fastlink?channelAppName=fingoalchannel'}`,
    `-e YOADLEE_API=${process.env.YOADLEE_API || 'https://fingoalchannel.stageapi.yodlee.com/ysl'}`,
    
    // Stripe
    `-e STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY || ''}`,
    `-e NEXT_PUBLIC_STRIPE_SECRET_KEY=${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY || ''}`,
    `-e NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}`,
    
    // Sendgrid
    `-e SENDGRID_API_KEY=${process.env.SENDGRID_API_KEY || ''}`,
    
    // Staging-specific variables
    `-e NEXT_PUBLIC_SITE_URL=https://finfy-staging.vercel.app`,
    `-e VERCEL_ENV=staging`
  ];
  
  // Execute the Vercel deploy command with environment variables
  const deployCommand = `${vercelCommand} --prod ${envVars.join(' ')}`;
  console.log(chalk.dim('Running command: vercel --prod [with env vars]'));
  
  execSync(deployCommand, { stdio: 'inherit' });
  
  console.log(chalk.green('Deployment to staging completed successfully!'));
  console.log(chalk.blue('Staging URL: https://finfy-staging.vercel.app'));
  console.log(chalk.blue('You can test your Yodlee integration on this staging environment.'));
} catch (error) {
  console.error(chalk.red('Deployment failed:'), error.message);
  process.exit(1);
} 