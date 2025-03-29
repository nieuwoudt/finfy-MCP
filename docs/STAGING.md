# Finfy Staging Environment Setup

This document outlines how to deploy and manage the Finfy staging environment on Vercel for testing Yodlee integrations.

## Overview

The staging environment allows you to test integrations like Yodlee without affecting the production environment. It uses the same codebase as production but with a separate deployment and potentially different configuration values.

## Deployment Options

You have several options for deploying your staging environment:

### Option 1: Deploy via Vercel Dashboard (Recommended for beginners)

1. Create a Vercel account at https://vercel.com if you don't have one already
2. Go to your Vercel dashboard and click "Add New..." > "Project"
3. Import your Git repository or upload your project files
4. Configure the project:
   - Set a project name (e.g., "finfy-staging")
   - Select "Next.js" as the framework
   - Under "Environment Variables", add all the required variables from your `.env.local` file:
     - All Supabase variables
     - All Plaid variables
     - All Yodlee variables
     - All Stripe variables
     - Sendgrid API key
     - Add `VERCEL_ENV=staging`
     - Add `NEXT_PUBLIC_SITE_URL=https://[your-project-name].vercel.app`
5. Click "Deploy"

### Option 2: Deploy using the script (CLI approach)

#### Prerequisites

- Local `.env.local` file with all required environment variables
- Vercel CLI installed locally in your project (`npm install --save-dev vercel`)

#### Deploy to Staging

To deploy the application to staging:

```bash
# From the project root
npm run deploy-staging
```

This script will:
1. Use all environment variables from your local `.env.local` file
2. Deploy to Vercel with the staging configuration
3. Set the `VERCEL_ENV` to "staging"
4. Use `https://finfy-staging.vercel.app` as the site URL

### Option 3: Manual Deployment with CLI

You can also deploy manually using the Vercel CLI:

```bash
# Use locally installed CLI
npx vercel --prod
```

## Yodlee Integration Testing

### Configuration

The staging environment uses the following Yodlee configuration:

- Yodlee stage API: `https://fingoalchannel.stageapi.yodlee.com/ysl`
- Yodlee FastLink URL: `https://finapp.fingoalchannelstage.yodlee.com/authenticate/finfy-development/fastlink?channelAppName=fingoalchannel`

### Testing Steps

1. Access the staging environment at your Vercel deployment URL (e.g., `https://finfy-staging.vercel.app`)
2. Log in with test credentials
3. Navigate to the account linking flow
4. Test the Yodlee integration using sandbox credentials
5. Verify that accounts are properly linked and data is being fetched correctly

## Troubleshooting

If you encounter issues with the Yodlee integration:

1. Check the browser console for any errors
2. Verify that all Yodlee environment variables are properly set in Vercel
   - Go to your Vercel project settings > Environment Variables
3. Check Vercel function logs for API errors
   - Go to your Vercel project > Deployments > Latest deployment > Functions
4. Ensure that the Yodlee API is responding correctly from the staging environment

## Environment Variables

These are the key environment variables for Yodlee integration:

```
YODLEE_BASE_URL=https://fingoalchannel.stageapi.yodlee.com/ysl
YODLEE_CLIENT_ID=[your client id]
YODLEE_CLIENT_SECRET=[your client secret]
YODLEE_API_VERSION=1.1
YODLEE_LOGIN_NAME=[your login name]
YODLEE_FASTLINK_URL=https://finapp.fingoalchannelstage.yodlee.com/authenticate/finfy-development/fastlink?channelAppName=fingoalchannel
NEXT_PUBLIC_YODLEE_FASTLINK_URL=https://finapp.fingoalchannelstage.yodlee.com/authenticate/finfy-development/fastlink?channelAppName=fingoalchannel
NEXT_PUBLIC_SITE_URL=https://finfy-staging.vercel.app
YOADLEE_API=https://fingoalchannel.stageapi.yodlee.com/ysl
``` 