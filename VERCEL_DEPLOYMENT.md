# Deploying Your Full Stack Application to Vercel

This guide will help you deploy your BalanceSheetTracker application to Vercel, which offers a generous free tier and is excellent for full-stack applications.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository
- A Neon database (already set up)

## Step 1: Create a Vercel Account

1. Go to [vercel.com](https://vercel.com/) and sign up for an account
2. You can sign up with your GitHub account for easier integration

## Step 2: Deploy to Vercel

1. Go to the Vercel dashboard and click "New Project"
2. Import your GitHub repository
3. Configure your project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

Add the following environment variables in the Vercel dashboard:

- `DATABASE_URL`: Your Neon database connection string (already set up)
- `JWT_SECRET`: A strong secret key for JWT authentication
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: `https://your-vercel-app-name.vercel.app/api/auth/google/callback`
- `VERCEL`: `1` (This tells your app it's running on Vercel)

## Step 4: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your application
3. Once deployed, you can access your application at the URL provided by Vercel

## How This Works

Your application is set up to deploy both the frontend and backend on Vercel:

1. The frontend (React app) is built with Vite and served as static files
2. The backend (Express API) is deployed as a serverless function
3. The `vercel.json` configuration routes API requests to your serverless function
4. The `api/index.js` file serves as the entry point for the serverless function

## Troubleshooting

If you encounter issues:

1. Check the Vercel deployment logs for error messages
2. Verify your environment variables are set correctly
3. Make sure your Neon database is accessible from Vercel
4. Check that your application is properly configured for production

## Updating Your Application

To update your deployed application:

1. Push changes to your GitHub repository
2. Vercel will automatically rebuild and redeploy your application

## Database Management

Your database is already set up on Neon. If you need to make schema changes:

1. Update your schema files locally
2. Generate migrations: `npm run db:generate`
3. Apply migrations to your production database: `npm run db:migrate`

You can also use `npm run db:test` to verify your database connection.
