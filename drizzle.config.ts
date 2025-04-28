import { defineConfig } from "drizzle-kit";
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config();

// If we're running a production command, also load .env.production
if (process.argv.some(arg => arg.includes('prod') || arg.includes('migrate'))) {
  dotenv.config({ path: resolve(__dirname, '.env.production') });
  console.log('Loaded production environment variables');
} else {
  console.log('Using development environment variables');
}

// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please check your .env file.");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
