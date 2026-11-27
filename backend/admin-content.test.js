import test from 'node:test';
import assert from 'node:assert/strict';
import express from 'express';
import { fileURLToPath } from 'url';
import { registerAdminContent } from './admin-content.js';

test('administration routes validate, save, list, reorder, update and delete content', async () => {
  const rows = [];
  const pool = { query: async (sql, values = []) => {
    if (sql.includes('CREATE TABLE')) return { rows: [] };
    if (sql.startsWith('INSERT INTO admin_content')) {
      const row = { id: rows.length + 1, section: values[1], data: JSON.parse(values[0]), updated_at: new Date().toISOString() };
      rows.push(row); return { rows: [row] };
    }
    if (sql.startsWith('SELECT')) return { rows: rows.filter(row => row.section === values[0]) };
    if (sql.includes('unnest')) return { rows: [] };
    if (sql.startsWith('UPDATE admin_content')) {
      const row = rows.find(row => row.section === values[1] && row.id === Number(values[2]));
      if (row) row.data = JSON.parse(values[0]);
      return { rows: row ? [row] : [] };
    }
    if (sql.startsWith('DELETE')) {
      const index = rows.findIndex(row => row.id === Number(values[0]) && row.section === values[1]);
      if (index !== -1) rows.splice(index, 1);
      return { rowCount: index === -1 ? 0 : 1 };
    }
    throw new Error(`Unexpected query: ${sql}`);
  } };
  const app = express(); app.use(express.json());
  registerAdminContent(app, pool, fileURLToPath(new URL('.', import.meta.url)));
  const server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (url, method = 'GET', data) => fetch(`${base}${url}`, { method, headers: { 'Content-Type': 'application/json' }, body: data === undefined ? undefined : JSON.stringify(data) });
  try {
    assert.equal((await request('/api/admin/content/unknown')).status, 404);
    assert.equal((await request('/api/admin/content/gallery', 'POST', {})).status, 400);
    assert.equal((await request('/api/admin/content/notices', 'POST', { title: 'Notice' })).status, 400);
    assert.equal((await request('/api/admin/content/gallery/reorder', 'POST', { ids: ['invalid'] })).status, 400);
    const created = await request('/api/admin/content/gallery', 'POST', { title: 'Photo', category: 'green', image_url: '/test.jpg' });
    assert.equal(created.status, 201);
    const item = (await created.json()).data;
    assert.equal(item.title, 'Photo');
    assert.equal((await (await request('/api/admin/content/gallery')).json()).data.length, 1);
    assert.equal((await request('/api/admin/content/gallery/reorder', 'POST', { ids: [item.id] })).status, 200);
    const edited = await request(`/api/admin/content/gallery/${item.id}`, 'PUT', { title: 'Updated photo' });
    assert.equal((await edited.json()).data.title, 'Updated photo');
    assert.equal((await request(`/api/admin/content/gallery/${item.id}`, 'DELETE')).status, 200);
    assert.equal((await request(`/api/admin/content/gallery/${item.id}`, 'DELETE')).status, 404);
    assert.equal((await request('/api/upload/document', 'POST', {})).status, 400);
  } finally { await new Promise(resolve => server.close(resolve)); }
});