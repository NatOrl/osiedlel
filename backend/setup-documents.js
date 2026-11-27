import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'osiedlel',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupDocumentsTable() {
  try {
    console.log('Connecting to database...');
    
    // Read the SQL file
    const sqlFile = path.join(__dirname, 'database', 'add-documents-table.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Creating documents table and inserting sample data...');
    await pool.query(sql);
    
    console.log('✅ Documents table created successfully!');
    console.log('✅ Sample documents data inserted!');
    
    // Verify the data
    const result = await pool.query('SELECT COUNT(*) FROM documents');
    console.log(`📄 Total documents in database: ${result.rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error setting up documents table:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDocumentsTable();
