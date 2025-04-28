// scripts/migrate-prod-db.js
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// First check if .env.production exists
const prodEnvPath = resolve(__dirname, '../.env.production');
if (!fs.existsSync(prodEnvPath)) {
  console.error('Error: .env.production file not found!');
  console.error('Please create a .env.production file with your production database connection string.');
  console.error('Example:');
  console.error('DATABASE_URL=postgres://username:password@hostname:port/database');
  process.exit(1);
}

// Load environment variables from .env.production file
dotenv.config({ path: prodEnvPath });

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set in your .env.production file.');
  console.error('Please add your production database connection string to .env.production');
  console.error('Example:');
  console.error('DATABASE_URL=postgres://username:password@hostname:port/database');
  process.exit(1);
}

console.log('Starting database migration...');
console.log('Using database URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Hide password in logs

// Run migrations
async function runMigrations() {
  let migrationClient;

  try {
    migrationClient = postgres(process.env.DATABASE_URL, { max: 1 });
    const db = drizzle(migrationClient);

    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: './migrations' });
    console.log('Migrations completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    if (migrationClient) {
      await migrationClient.end();
    }
  }
}

runMigrations();
