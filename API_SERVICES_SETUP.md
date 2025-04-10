# API Services Setup Guide

This document outlines all the external services and API keys needed to fully run the Finfy AI application.

## Supabase

Supabase is used for authentication, database, and storage.

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Get your API credentials from Project Settings > API
4. Set up the following environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Plaid

Plaid is used for connecting bank accounts and retrieving financial data.

1. Create a Plaid account at https://plaid.com
2. Get your API credentials from the Dashboard
3. Set up the following environment variables:
   - `PLAID_CLIENT_ID`
   - `PLAID_SECRET`
   - `PLAID_ENV` (sandbox, development, or production)

## Stripe

Stripe is used for payment processing.

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Developers > API keys section
3. Set up the following environment variables:
   - `STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_SECRET_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## SendGrid

SendGrid is used for sending emails.

1. Create a SendGrid account at https://sendgrid.com
2. Create an API key with full access to Mail Send
3. Set up the following environment variable:
   - `SENDGRID_API_KEY`

## Yodlee

Yodlee is used as an alternative to Plaid for certain financial data.

1. Contact Yodlee sales for API access
2. Once you have access, set up the following environment variables:
   - `YODLEE_CLIENT_ID`
   - `YODLEE_CLIENT_SECRET`
   - `YODLEE_API_URL`
   - `YODLEE_DATASET_NAME`
   - `YODLEE_FASTLINK_URL`

## FinGoal

FinGoal is used for transaction enrichment and financial insights.

1. Contact FinGoal for API access
2. Once you have access, set up the following environment variables:
   - `FINGOAL_CLIENT_ID`
   - `FINGOAL_CLIENT_SECRET`
   - `FINGOAL_API_URL`
   - `FINGOAL_WEBHOOK_URL`
   - `FINGOAL_WEBHOOK_SIGNATURE`

## Sentry (Optional)

Sentry is used for error tracking and monitoring.

1. Create a Sentry account at https://sentry.io
2. Create a new project
3. Get your DSN from the project settings
4. Set up the following environment variable:
   - `SENTRY_DSN`

## Application URL

Set the application URL for redirects and webhooks:

- For local development: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- For production: `NEXT_PUBLIC_APP_URL=https://your-app-domain.com` 