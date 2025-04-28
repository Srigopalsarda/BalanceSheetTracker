// scripts/test-db-connection.js
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
  process.exit(1);
}

// Load environment variables from .env.production file
dotenv.config({ path: prodEnvPath });

if (!process.env.DATABASE_URL) {
  console.error('Error: DATABASE_URL environment variable is not set in your .env.production file.');
  process.exit(1);
}

console.log('Testing database connection...');
console.log('Using database URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@')); // Hide password in logs

async function testConnection() {
  let client;
  
  try {
    client = postgres(process.env.DATABASE_URL, { max: 1 });
    
    // Test the connection by running a simple query
    console.log('Running test query...');
    const result = await client.unsafe('SELECT version()');
    console.log('Connection successful!');
    console.log('PostgreSQL version:', result[0].version);
    
    // List all tables
    console.log('\nListing all tables:');
    const tables = await client.unsafe(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    if (tables.length === 0) {
      console.log('No tables found in the database.');
    } else {
      tables.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    }
    
  } catch (error) {
    console.error('Connection failed:', error);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

testConnection();
