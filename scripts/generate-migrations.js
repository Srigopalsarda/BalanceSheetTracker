// scripts/generate-migrations.js
import { exec } from 'child_process';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: resolve(__dirname, '../.env') });

console.log('Generating migrations using database URL:', 
  process.env.DATABASE_URL ? 
  process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@') : // Hide password in logs
  'DATABASE_URL not found');

// Run drizzle-kit generate command
exec('drizzle-kit generate:pg', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log('Migration files generated successfully!');
});
