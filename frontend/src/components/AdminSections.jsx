import { useEffect, useState } from 'react';
import AdminIcon from './AdminIcon';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS } from '../data/galleryPhotos';

const today = () => new Date().toISOString().slice(0, 10);
const fields = {
  notices: [['title', 'Tytuł', 'text', true], ['category', 'Kategoria'], ['description', 'Opis', 'textarea', true], ['published_date', 'Data publikacji', 'date', true], ['valid_from', 'Ważny od', 'date', true], ['valid_until', 'Ważny do', 'date'], ['is_important', 'Ważny komunikat', 'checkbox'], ['image_url', 'Zdjęcie', 'image']],
  gallery: [['title', 'Opis zdjęcia', 'text', true], ['category', 'Kategoria', 'category', true], ['image_url', 'Zdjęcie', 'image', true]],
  events: [['title', 'Nazwa zajęć lub wydarzenia', 'text', true], ['description', 'Opis', 'textarea', true], ['date', 'Data', 'date', true], ['time', 'Godzina', 'time', true], ['schedule', 'Harmonogram'], ['location', 'Miejsce'], ['image_url', 'Zdjęcie', 'image']],
  council: [['title', 'Imię i nazwisko', 'text', true], ['role', 'Funkcja', 'text', true], ['email', 'E-mail', 'email'], ['phone', 'Telefon', 'tel'], ['meeting_date', 'Termin spotkania', 'datetime-local']],
  residents: [['title', 'Nazwa informacji', 'text', true], ['category', 'Grupa (godziny biura, telefony, inne)', 'text', true], ['description', 'Treść informacji', 'textarea', true]],
};

async function adminRequest(url, options) {
  const response = await fetch(url, options);
  const result = await response.json();
  if (!response.ok || !result.success) throw new Error(result.error || 'Nie udało się zapisać zmian.');
  return result.data;
}

export default function AdminSections({ section, onChange }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const endpoint = `/api/admin/content/${section}`;

  useEffect(() => {
    let ignore = false;
    adminRequest(endpoint).then(data => { if (!ignore) setItems(data); })
      .catch(() => { if (!ignore) setError('Nie udało się pobrać treści. Sprawdź połączenie z serwerem.'); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [endpoint]);

  const save = async e => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const saved = await adminRequest(`${endpoint}${form.id ? `/${form.id}` : ''}`, {
        method: form.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      });
      setItems(await adminRequest(endpoint));
      setForm(null);
      onChange(saved.title, section);
    } catch { setError('Nie udało się zapisać. Spróbuj ponownie.'); }
    finally { setSaving(false); }
  };

  const remove = async item => {
    if (!window.confirm(`Usunąć „${item.title}”?`)) return;
    try {
      await adminRequest(`${endpoint}/${item.id}`, { method: 'DELETE' });
      setItems(items.filter(entry => entry.id !== item.id));
      onChange(item.title, section);
    } catch { setError('Nie udało się usunąć treści.'); }
  };

  const upload = async file => {
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setError('Wybierz zdjęcie JPG, PNG, WebP lub GIF do 5 MB.'); return;
    }
    setUploading(true);
    try {
      const body = new FormData(); body.append('image', file);
      const response = await fetch('/api/upload/announcement-image', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error();
      setForm(previous => ({ ...previous, image_url: result.imageUrl }));
    } catch { setError('Nie udało się przesłać zdjęcia.'); }
    finally { setUploading(false); }
  };

  const move = async (index, direction) => {
    const reordered = [...items];
    [reordered[index], reordered[index + direction]] = [reordered[index + direction], reordered[index]];
    try {
      await adminRequest(`${endpoint}/reorder`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: reordered.map(item => item.id) }) });
      setItems(reordered); onChange('Kolejność zdjęć', section);
    } catch { setError('Nie udało się zmienić kolejności.'); }
  };

  const importGallery = async () => {
    setSaving(true);
    try {
      for (const photo of GALLERY_PHOTOS) {
        await adminRequest(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: photo.alt, category: photo.category, image_url: photo.url }) });
      }
      setItems(await adminRequest(endpoint)); onChange('Import galerii', section);
    } catch { setError('Import nie powiódł się. Sprawdź listę przed ponowną próbą.'); }
    finally { setSaving(false); }
  };

  return <div className="admin-content">
    <div className="admin-section-toolbar"><span>{items.length} {section === 'gallery' ? 'zdjęć' : 'wpisów'}</span><button className="add-btn" onClick={() => setForm({ title: '', published_date: today(), valid_from: today(), is_important: true })}>+ Dodaj nowy</button></div>
    {error && <p className="admin-feedback" role="alert">{error}</p>}
    {form && <form className="admin-form" onSubmit={save}>
      <h3>{form.id ? 'Edytuj wpis' : 'Nowy wpis'}</h3>
      {fields[section].map(([name, label, type = 'text', required]) => <div className="form-group" key={name}>
        {type === 'image' ? <>
          <label htmlFor={`admin-${name}`}>{label}{required && ' *'}</label>
          <div className="admin-dropzone" onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); upload(e.dataTransfer.files[0]); }}>
            <AdminIcon name="upload" /><p>Przeciągnij zdjęcie lub wybierz plik</p><small>JPG, PNG, WebP, GIF · maks. 5 MB</small>
            <input id={`admin-${name}`} type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={uploading} required={required && !form.image_url} onChange={e => upload(e.target.files[0])} />
          </div>
          {uploading && <p role="status">Przesyłanie zdjęcia…</p>}
          {form.image_url && <img className="admin-image-preview" src={form.image_url} alt="Podgląd zdjęcia" />}
        </> : <label className={type === 'checkbox' ? 'admin-checkbox' : ''}>
          {label}{required && ' *'}
          {type === 'textarea' ? <textarea rows="5" required={required} value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })} />
            : type === 'category' ? <select required value={form[name] || ''} onChange={e => setForm({ ...form, [name]: e.target.value })}><option value="">Wybierz kategorię</option>{GALLERY_CATEGORIES.map(category => <option value={category.id} key={category.id}>{category.label}</option>)}</select>
              : type === 'checkbox' ? <input type="checkbox" checked={!!form[name]} onChange={e => setForm({ ...form, [name]: e.target.checked })} />
                : <input type={type} required={required} value={(form[name] || '').toString().slice(0, type === 'date' ? 10 : undefined)} onChange={e => setForm({ ...form, [name]: e.target.value })} />}
        </label>}
      </div>)}
      <div className="form-actions"><button className="submit-btn" disabled={saving || uploading}>{saving ? 'Zapisywanie…' : 'Zapisz zmiany'}</button><button type="button" className="cancel-btn" disabled={saving || uploading} onClick={() => setForm(null)}>Anuluj</button></div>
    </form>}
    {loading ? <p role="status">Wczytywanie treści…</p> : items.length === 0 ? <div className="admin-empty"><AdminIcon name={section} /><h3>Brak treści w tej sekcji</h3><p>Dodaj pierwszy wpis, aby rozpocząć.</p>{section === 'gallery' && <button className="cancel-btn" disabled={saving} onClick={importGallery}>Importuj istniejące zdjęcia</button>}</div> :
      <div className={section === 'gallery' ? 'admin-photo-grid' : 'items-list'}>{items.map((item, index) => <article className="item-card" key={item.id}>
        {item.image_url && <img className="admin-content-thumbnail" src={item.image_url} alt={item.title} />}
        <div className="item-info"><h3>{item.title}</h3><p className="item-meta">{item.category || item.role}{item.is_important && <span className="badge">Ważny</span>}</p><p className="item-summary">{item.description || item.email}</p><p className="item-meta">{item.published_date?.slice(0, 10) || item.date || item.meeting_date?.replace('T', ' ')} {item.time} {item.phone}</p>{item.schedule && <p>{item.schedule}</p>}{item.location && <p>{item.location}</p>}</div>
        <div className="item-actions"><button className="edit-btn" onClick={() => setForm({ ...item })}>Edytuj</button><button className="delete-btn" onClick={() => remove(item)}>Usuń</button>{section === 'gallery' && <><button className="cancel-btn" aria-label={`Przesuń ${item.title} wcześniej`} disabled={index === 0} onClick={() => move(index, -1)}>↑</button><button className="cancel-btn" aria-label={`Przesuń ${item.title} później`} disabled={index === items.length - 1} onClick={() => move(index, 1)}>↓</button></>}</div>
      </article>)}</div>}
  </div>;
}