import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'osiedlel',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

async function setupContactMessagesTable() {
  try {
    console.log('Setting up contact_messages table...');
    
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const sqlPath = join(__dirname, 'database', 'add-contact-messages-table.sql');
    const sql = readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    
    console.log('✅ Contact messages table created successfully!');
    console.log('✅ Sample data inserted');
    console.log('\nYou can now use the contact form at http://localhost:5173/contact');
    
  } catch (error) {
    console.error('❌ Error setting up contact_messages table:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupContactMessagesTable();
