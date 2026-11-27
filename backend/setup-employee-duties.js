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

async function setupEmployeeDuties() {
  try {
    console.log('Setting up employee duties table...');
    
    const sqlFile = join(__dirname, 'database', 'add-employee-duties-table.sql');
    const sql = readFileSync(sqlFile, 'utf8');
    
    await pool.query(sql);
    
    console.log('✓ Employee duties table created successfully!');
    console.log('✓ Sample data inserted!');
    
    // Verify the data
    const result = await pool.query('SELECT * FROM employee_duties');
    console.log('\nCurrent employee duties:');
    console.log(result.rows);
    
  } catch (error) {
    console.error('Error setting up employee duties table:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupEmployeeDuties();
