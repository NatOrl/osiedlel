import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { registerAdminContent } from './admin-content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const { Pool } = pg;

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'osiedlel',
  password: process.env.DB_PASSWORD || 'postgres',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads', 'announcements');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'announcement-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to OsiedleL API' });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Example API endpoint
app.get('/api/data', (req, res) => {
  res.json({
    data: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' }
    ]
  });
});

// Database query example
app.get('/api/db/test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, version() as db_version');
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Database query failed',
      message: error.message
    });
  }
});

// Example: Get all items from database (you'll need to create this table)
app.get('/api/items', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY id');
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch items',
      message: error.message
    });
  }
});

// Example: Create new item
app.post('/api/items', async (req, res) => {
  const { name, description } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create item',
      message: error.message
    });
  }
});

// Posts/Announcements endpoints
// Get all posts (announcements)
app.get('/api/posts', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts ORDER BY published_date DESC, created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch posts',
      message: error.message
    });
  }
});

// Get single post by ID
app.get('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch post',
      message: error.message
    });
  }
});

// Upload image endpoint
app.post('/api/upload/announcement-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No image file provided'
      });
    }
    
    const imageUrl = `/uploads/announcements/${req.file.filename}`;
    res.json({
      success: true,
      imageUrl: imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload image',
      message: error.message
    });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  const { title, category, summary, content, published_date, images } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (title, category, summary, content, published_date, images) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, category, summary, content, published_date || new Date(), JSON.stringify(images || [])]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create post',
      message: error.message
    });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, category, summary, content, published_date, images } = req.body;
  try {
    const result = await pool.query(
      'UPDATE posts SET title = $1, category = $2, summary = $3, content = $4, published_date = $5, images = $6 WHERE id = $7 RETURNING *',
      [title, category, summary, content, published_date, JSON.stringify(images || []), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update post',
      message: error.message
    });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      message: 'Post deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete post',
      message: error.message
    });
  }
});

// Documents endpoints for Task 3: Document Library
// Get all documents
app.get('/api/documents', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM documents ORDER BY category, uploaded_date DESC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents',
      message: error.message
    });
  }
});

// Get documents by category
app.get('/api/documents/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM documents WHERE category = $1 ORDER BY uploaded_date DESC',
      [category]
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch documents',
      message: error.message
    });
  }
});

// Get single document by ID
app.get('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM documents WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch document',
      message: error.message
    });
  }
});

// Create new document
app.post('/api/documents', async (req, res) => {
  const { title, description, category, file_url, file_name, file_size, uploaded_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO documents (title, description, category, file_url, file_name, file_size, uploaded_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, category, file_url, file_name, file_size, uploaded_date || new Date()]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create document',
      message: error.message
    });
  }
});

// Update document
app.put('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, category, file_url, file_name, file_size, uploaded_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE documents SET title = $1, description = $2, category = $3, file_url = $4, file_name = $5, file_size = $6, uploaded_date = $7 WHERE id = $8 RETURNING *',
      [title, description, category, file_url, file_name, file_size, uploaded_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update document',
      message: error.message
    });
  }
});

// Delete document
app.delete('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM documents WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }
    res.json({
      success: true,
      message: 'Document deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document',
      message: error.message
    });
  }
});

// Contact Messages endpoints for Task 5: Contact System
// Get all contact messages (for admin panel)
app.get('/api/contact-messages', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC'
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact messages',
      message: error.message
    });
  }
});

// Get single contact message by ID
app.get('/api/contact-messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM contact_messages WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact message',
      message: error.message
    });
  }
});

// Create new contact message (from contact form)
app.post('/api/contact-messages', async (req, res) => {
  const { name, email, subject, message } = req.body;
  
  // Validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required'
    });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO contact_messages (name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, subject, message, 'new']
    );
    res.status(201).json({
      success: true,
      message: 'Contact message sent successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database insert error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send contact message',
      message: error.message
    });
  }
});

// Update contact message status (for admin)
app.put('/api/contact-messages/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await pool.query(
      'UPDATE contact_messages SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact message',
      message: error.message
    });
  }
});

// Delete contact message
app.delete('/api/contact-messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM contact_messages WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found'
      });
    }
    res.json({
      success: true,
      message: 'Contact message deleted successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database delete error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete contact message',
      message: error.message
    });
  }
});

// Employee Duties endpoints
// Get employee duties (should only be one record)
app.get('/api/employee-duties', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM employee_duties ORDER BY id DESC LIMIT 1'
    );
    res.json({
      success: true,
      data: result.rows[0] || null
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee duties',
      message: error.message
    });
  }
});

// Update employee duties
app.put('/api/employee-duties/:id', async (req, res) => {
  const { id } = req.params;
  const { duty_dates, employees } = req.body;
  try {
    const result = await pool.query(
      'UPDATE employee_duties SET duty_dates = $1, employees = $2 WHERE id = $3 RETURNING *',
      [duty_dates, JSON.stringify(employees), id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Employee duties not found'
      });
    }
    res.json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Database update error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee duties',
      message: error.message
    });
  }
});

// Important notices ("Ważne komunikaty") endpoints
// Get currently relevant notices: already published and not yet expired.
// Upcoming notices (valid_from in the future) are returned too so residents can be warned in advance.
app.get('/api/important-notices', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, title, category, description,
              published_date::text AS published_date,
              valid_from::text AS valid_from,
              valid_until::text AS valid_until
       FROM important_notices
       WHERE published_date <= CURRENT_DATE
         AND (valid_until IS NULL OR valid_until >= CURRENT_DATE)
       ORDER BY valid_from ASC, published_date DESC, id DESC`
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch important notices',
      message: error.message
    });
  }
});

// Employees endpoints (estate administration)
// Get employees. Use ?featured=true to get only the ones presented on the home page.
app.get('/api/employees', async (req, res) => {
  const featuredOnly = req.query.featured === 'true';
  try {
    const result = await pool.query(
      `SELECT * FROM employees
       ${featuredOnly ? 'WHERE is_featured = TRUE' : ''}
       ORDER BY sort_order ASC, id ASC`
    );
    res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees',
      message: error.message
    });
  }
});


registerAdminContent(app, pool, __dirname);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
