# Separate Deployment Guide for BalanceSheetTracker

This guide will help you deploy your BalanceSheetTracker application with the frontend and backend on separate platforms.

## Prerequisites

- A GitHub account
- Your project pushed to GitHub repositories (one for frontend, one for backend)
- A Neon database (already set up)

## Step 1: Prepare Your Repositories

### Backend Repository

1. Create a new GitHub repository for your backend (e.g., `balance-sheet-tracker-api`)
2. Copy the `server` directory and necessary shared files to this repository:
   ```
   server/
   shared/
   scripts/
   .env.backend (rename to .env.production)
   server/.env.example
   server/render.yaml
   ```

### Frontend Repository

1. Create a new GitHub repository for your frontend (e.g., `balance-sheet-tracker-frontend`)
2. Copy the `client` directory and necessary shared files to this repository:
   ```
   client/
   shared/
   .env.frontend (rename to .env)
   ```

## Step 2: Deploy the Backend to Render

1. Go to [render.com](https://render.com/) and sign up for an account
2. Connect your backend GitHub repository
3. Create a new Web Service:
   - **Name**: balance-sheet-tracker-api
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Plan**: Free

4. Configure environment variables in the Render dashboard:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: Your Neon database connection string
   - `JWT_SECRET`: A strong secret key for JWT authentication
   - `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
   - `GOOGLE_REDIRECT_URI`: `https://your-backend-url.onrender.com/api/auth/google/callback`
   - `FRONTEND_URL`: `https://your-frontend-url.vercel.app`
   - `OPENROUTER_API_KEY`: Your OpenRouter API key
   - `HUGGING_FACE_API_KEY`: Your Hugging Face API key

5. Deploy the backend
6. Note the URL of your deployed backend (e.g., `https://balance-sheet-tracker-api.onrender.com`)

## Step 3: Deploy the Frontend to Vercel

1. Go to [vercel.com](https://vercel.com/) and sign up for an account
2. Connect your frontend GitHub repository
3. Create a new project:
   - **Framework Preset**: Vite
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

4. Configure environment variables in the Vercel dashboard:
   - `VITE_API_URL`: `https://your-backend-url.onrender.com/api`

5. Deploy the frontend
6. Note the URL of your deployed frontend (e.g., `https://balance-sheet-tracker.vercel.app`)

## Step 4: Update Google OAuth Configuration

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your project's OAuth consent screen and credentials
3. Update the authorized redirect URI:
   - `https://your-backend-url.onrender.com/api/auth/google/callback`
4. Update the authorized JavaScript origins:
   - `https://your-frontend-url.vercel.app`

## Step 5: Test Your Deployment

1. Visit your frontend URL
2. Try to log in or register
3. Test various features to ensure they're working correctly

## Troubleshooting

### CORS Issues

If you encounter CORS issues, update your backend to allow requests from your frontend domain:

```javascript
// In server/index.ts
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
```

### Database Connection Issues

If your backend can't connect to the database:
1. Check that your DATABASE_URL is correct in the Render environment variables
2. Ensure your Neon database is in an active state
3. Verify that your IP is allowed in Neon's connection settings

### Authentication Issues

If users can't log in:
1. Check that your JWT_SECRET is set correctly
2. Verify that your Google OAuth configuration is correct
3. Ensure the FRONTEND_URL is set correctly for redirects

## Updating Your Deployment

### Backend Updates

1. Push changes to your backend GitHub repository
2. Render will automatically rebuild and redeploy your backend

### Frontend Updates

1. Push changes to your frontend GitHub repository
2. Vercel will automatically rebuild and redeploy your frontend
