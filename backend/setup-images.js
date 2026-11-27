import pg from 'pg';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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

async function setupImages() {
  try {
    console.log('Starting image support setup for posts table...');
    
    // Read and execute the SQL file
    const sqlFile = join(__dirname, 'database', 'add-images-to-posts.sql');
    const sql = readFileSync(sqlFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✓ Image support added to posts table successfully!');
    console.log('✓ Posts table now supports image_url and image_alt columns');
    
  } catch (error) {
    console.error('Error setting up image support:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupImages();
