# Finfy AI

Finfy AI is a financial management platform that helps users track their expenses, manage their budget, and get personalized financial insights.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Git

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd finfy-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in all the required environment variables with your API keys and credentials

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The following environment variables are required:

### Supabase Configuration
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Plaid Configuration
- `PLAID_CLIENT_ID`: Your Plaid client ID
- `PLAID_SECRET`: Your Plaid secret key
- `PLAID_ENV`: Plaid environment (production/sandbox)

### Stripe Configuration
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_SECRET_KEY`: Your Stripe secret key (public)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### SendGrid Configuration
- `SENDGRID_API_KEY`: Your SendGrid API key

### Application URL
- `NEXT_PUBLIC_APP_URL`: Your application URL (default: http://localhost:3000)

## Project Structure

```
finfy-ai/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── config/          # Configuration files
│   ├── lib/             # Utility libraries
│   ├── store/           # Redux store
│   └── utils/           # Utility functions
├── public/              # Static files
└── ...config files
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## Support

For support, email info@finfy.ai or join our Slack channel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

 

