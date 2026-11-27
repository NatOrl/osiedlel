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

async function setupHomepageContent() {
  try {
    console.log('Setting up important notices and employees tables...');

    const sqlFile = join(__dirname, 'database', 'add-notices-and-employees-tables.sql');
    const sql = readFileSync(sqlFile, 'utf8');

    await pool.query(sql);

    console.log('✓ Important notices table created successfully!');
    console.log('✓ Employees table created successfully!');

    const notices = await pool.query('SELECT id, title, published_date, valid_until FROM important_notices ORDER BY id');
    console.log('\nCurrent important notices:');
    console.log(notices.rows);

    const employees = await pool.query('SELECT id, full_name, position, is_featured FROM employees ORDER BY sort_order, id');
    console.log('\nCurrent employees:');
    console.log(employees.rows);
  } catch (error) {
    console.error('Error setting up important notices and employees tables:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupHomepageContent();
