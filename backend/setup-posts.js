import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'osiedlel',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupPostsTable() {
  try {
    console.log('Connecting to database...');
    
    // Read the SQL file
    const sql = fs.readFileSync('./database/add-posts-table.sql', 'utf8');
    
    console.log('Creating posts table...');
    await pool.query(sql);
    
    console.log('✅ SUCCESS! Posts table created with sample data.');
    
    // Verify
    const result = await pool.query('SELECT COUNT(*) FROM posts');
    console.log(`📊 Total posts in database: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
}

setupPostsTable();
