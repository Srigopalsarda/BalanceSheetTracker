# Database Deployment Guide

This guide will help you deploy your BalanceSheetTracker database to Neon, a serverless PostgreSQL provider.

## Prerequisites

- A Neon account (sign up at https://neon.tech/)
- Node.js and npm installed on your machine

## Step 1: Create a Database on Neon

1. Sign up or log in to Neon at https://neon.tech/
2. Create a new project (e.g., "balance-sheet-tracker")
3. Choose a region closest to your users
4. After project creation, you'll be provided with a connection string

## Step 2: Update Environment Variables

1. Open the `.env.production` file in your project
2. Replace the `DATABASE_URL` value with your Neon connection string:

```
DATABASE_URL=postgres://your-username:your-password@your-endpoint/your-database
```

3. Update other environment variables as needed for production:
   - Set a strong `JWT_SECRET`
   - Update `FRONTEND_URL` to your production domain
   - Update `GOOGLE_REDIRECT_URI` to use your production domain

## Step 3: Run Database Migrations

Run the following command to apply your database schema to the Neon database:

```bash
npm run db:migrate
```

This will run the migrations defined in your `migrations` folder against your production database.

## Step 4: Verify Database Connection

You can verify your database connection by running:

```bash
npm run db:studio
```

This will open Drizzle Studio, where you can connect to your production database and verify that your tables have been created correctly.

## Step 5: Update Your Application for Production

When deploying your application, make sure to:

1. Build your application with `npm run build`
2. Start your application with `npm run start`
3. Ensure your application is using the production environment variables

## Troubleshooting

- If you encounter connection issues, verify that your Neon database is in an active state
- Check that your connection string is correctly formatted
- Ensure your IP address is allowed in Neon's connection settings
- Verify that your database user has the necessary permissions

## Additional Resources

- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
