import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';

// Extends the existing demo administration API. Production deployments must
// protect ALL mutation routes with server-side authentication and authorization.
export function registerAdminContent(app, pool, root) {
  const sections = new Set(['gallery', 'events', 'council', 'residents']);
  let initialization;
  const initialize = () => {
    if (!initialization) {
      initialization = pool.query(`
        CREATE TABLE IF NOT EXISTS admin_content (
          id SERIAL PRIMARY KEY, section TEXT NOT NULL, data JSONB NOT NULL,
          sort_order INTEGER NOT NULL DEFAULT 0,
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
        ALTER TABLE important_notices ADD COLUMN IF NOT EXISTS is_important BOOLEAN NOT NULL DEFAULT TRUE;
        ALTER TABLE important_notices ADD COLUMN IF NOT EXISTS image_url TEXT;
      `).catch(error => { initialization = null; throw error; });
    }
    return initialization;
  };
  const route = handler => async (req, res) => {
    try { await initialize(); await handler(req, res); }
    catch (error) {
      console.error('Administration API error:', error);
      res.status(500).json({ success: false, error: 'Nie udało się wykonać operacji.' });
    }
  };
  const serialize = row => ({ ...row.data, id: row.id, updated_at: row.updated_at });
  app.use('/api/admin/content/:section', (req, res, next) => {
    if (!sections.has(req.params.section) && req.params.section !== 'notices') return res.status(404).json({ success: false, error: 'Nieznana sekcja.' });
    next();
  });
  app.get('/api/admin/content/:section', route(async (req, res) => {
    const notices = req.params.section === 'notices';
    const result = await pool.query(notices
      ? 'SELECT *, published_date::text, valid_from::text, valid_until::text FROM important_notices ORDER BY important_notices.published_date DESC, id DESC'
      : 'SELECT * FROM admin_content WHERE section = $1 ORDER BY sort_order, id', notices ? [] : [req.params.section]);
    res.json({ success: true, data: notices ? result.rows : result.rows.map(serialize) });
  }));
  app.post('/api/admin/content/:section/reorder', route(async (req, res) => {
    if (req.params.section !== 'gallery' || !Array.isArray(req.body.ids) || !req.body.ids.every(Number.isInteger)) return res.status(400).json({ success: false, error: 'Nieprawidłowa kolejność.' });
    await pool.query(`UPDATE admin_content SET sort_order = ordering.position, updated_at = NOW()
      FROM unnest($1::int[]) WITH ORDINALITY AS ordering(id, position)
      WHERE admin_content.id = ordering.id AND section = $2`, [req.body.ids, req.params.section]);
    res.json({ success: true, data: null });
  }));
  const save = update => route(async (req, res) => {
    const { title, description, category, published_date, valid_from, valid_until, is_important, image_url } = req.body;
    if (typeof title !== 'string' || !title.trim()) return res.status(400).json({ success: false, error: 'Tytuł jest wymagany.' });
    let result;
    if (req.params.section === 'notices') {
      if (!description || !published_date || !valid_from || (valid_until && valid_until < valid_from)) return res.status(400).json({ success: false, error: 'Sprawdź opis i daty ważności.' });
      const values = [title, category || '', description, published_date, valid_from, valid_until || null, !!is_important, image_url || null];
      result = await pool.query(update
        ? 'UPDATE important_notices SET title=$1, category=$2, description=$3, published_date=$4, valid_from=$5, valid_until=$6, is_important=$7, image_url=$8, updated_at=NOW() WHERE id=$9 RETURNING *'
        : 'INSERT INTO important_notices (title,category,description,published_date,valid_from,valid_until,is_important,image_url) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *', update ? [...values, req.params.id] : values);
    } else {
      const { id: _id, updated_at: _date, ...data } = req.body;
      result = await pool.query(update
        ? 'UPDATE admin_content SET data=$1, updated_at=NOW() WHERE section=$2 AND id=$3 RETURNING *'
        : 'INSERT INTO admin_content (data, section) VALUES ($1,$2) RETURNING *', update ? [JSON.stringify(data), req.params.section, req.params.id] : [JSON.stringify(data), req.params.section]);
    }
    if (!result.rows.length) return res.status(404).json({ success: false, error: 'Nie znaleziono wpisu.' });
    res.status(update ? 200 : 201).json({ success: true, data: req.params.section === 'notices' ? result.rows[0] : serialize(result.rows[0]) });
  });
  app.post('/api/admin/content/:section', save(false));
  app.put('/api/admin/content/:section/:id', save(true));
  app.delete('/api/admin/content/:section/:id', route(async (req, res) => {
    const notices = req.params.section === 'notices';
    const result = await pool.query(notices ? 'DELETE FROM important_notices WHERE id=$1 RETURNING id' : 'DELETE FROM admin_content WHERE id=$1 AND section=$2 RETURNING id', notices ? [req.params.id] : [req.params.id, req.params.section]);
    if (!result.rowCount) return res.status(404).json({ success: false, error: 'Nie znaleziono wpisu.' });
    res.json({ success: true, data: null });
  }));

  const destination = path.join(root, 'uploads', 'documents');
  fs.mkdirSync(destination, { recursive: true });
  const upload = multer({
    storage: multer.diskStorage({ destination, filename: (req, file, cb) => cb(null, `${randomUUID()}.pdf`) }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => cb(null, file.mimetype === 'application/pdf' && path.extname(file.originalname).toLowerCase() === '.pdf'),
  });
  app.post('/api/upload/document', (req, res) => {
    upload.single('document')(req, res, error => {
      if (error || !req.file) return res.status(400).json({ success: false, error: 'Wybierz plik PDF do 10 MB.' });
      res.json({ success: true, data: { file_url: `/uploads/documents/${req.file.filename}`, file_name: req.file.originalname, file_size: req.file.size } });
    });
  });
}