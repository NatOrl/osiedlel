import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'osiedlel',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupMultipleImages() {
  try {
    console.log('🔄 Starting multiple images migration...');
    
    // Read and execute the SQL file
    const sqlPath = join(__dirname, 'database', 'add-multiple-images-to-posts.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Multiple images support added successfully!');
    console.log('📋 Posts table now supports multiple images per announcement');
    console.log('');
    console.log('Next steps:');
    console.log('1. Restart the backend server: start-backend.bat');
    console.log('2. Restart the frontend server: start-frontend.bat');
    console.log('3. Test by adding announcements with multiple images');
    
  } catch (error) {
    console.error('❌ Error during migration:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupMultipleImages();
