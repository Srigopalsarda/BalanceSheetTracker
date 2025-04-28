// scripts/test-connection.cjs
const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from .env.production file
const prodEnvPath = path.resolve(__dirname, '../.env.production');
dotenv.config({ path: prodEnvPath });

console.log('Testing database connection...');

// Create a new pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database!');
    console.log('Current time from database:', res.rows[0].now);
    
    // List all tables
    pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `, (err, res) => {
      if (err) {
        console.error('Error listing tables:', err);
      } else {
        console.log('\nTables in the database:');
        if (res.rows.length === 0) {
          console.log('No tables found.');
        } else {
          res.rows.forEach(row => {
            console.log(`- ${row.table_name}`);
          });
        }
      }
      
      // Close the connection
      pool.end();
    });
  }
});
