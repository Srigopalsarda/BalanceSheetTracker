// scripts/debug-env.js
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Current directory:', process.cwd());
console.log('Script directory:', __dirname);

// Check .env file
const envPath = resolve(__dirname, '../.env');
console.log('.env file exists:', fs.existsSync(envPath));

// Check .env.production file
const prodEnvPath = resolve(__dirname, '../.env.production');
console.log('.env.production file exists:', fs.existsSync(prodEnvPath));

// Load environment variables from .env file
dotenv.config({ path: envPath });
console.log('DATABASE_URL from .env:', process.env.DATABASE_URL ? 'exists' : 'not found');

// Load environment variables from .env.production file
dotenv.config({ path: prodEnvPath });
console.log('DATABASE_URL from .env.production:', process.env.DATABASE_URL ? 'exists' : 'not found');

// Print the DATABASE_URL (with password masked)
if (process.env.DATABASE_URL) {
  console.log('DATABASE_URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
}
