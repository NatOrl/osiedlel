import { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import AdminIcon from '../components/AdminIcon';
import AdminSections from '../components/AdminSections';
import './Administration.css';

const sections = [
  { id: 'home', title: 'Panel główny' },
  { id: 'notices', title: 'Ważne komunikaty', description: 'Publikuj ważne informacje i komunikaty dla mieszkańców.' },
  { id: 'announcements', icon: 'news', title: 'Aktualności', description: 'Dodawaj artykuły i informuj o życiu osiedla.' },
  { id: 'gallery', title: 'Galeria zdjęć', description: 'Przesyłaj zdjęcia i porządkuj osiedlową galerię.' },
  { id: 'documents', title: 'Dokumenty', description: 'Udostępniaj formularze, regulaminy i pliki PDF.' },
  { id: 'residents', title: 'Informacje dla mieszkańców', description: 'Aktualizuj godziny pracy, telefony i praktyczne informacje.' },
  { id: 'events', title: 'Zajęcia i wydarzenia', description: 'Zarządzaj wydarzeniami, zajęciami i ich harmonogramem.' },
  { id: 'council', title: 'Rada Osiedla', description: 'Aktualizuj skład rady, dane kontaktowe i terminy spotkań.' },
  { id: 'settings', title: 'Ustawienia', description: 'Informacje o panelu i bezpieczeństwie.' },
];

function Administration() {
  const { setAdminDashboard } = useOutletContext();
  // Check sessionStorage for existing authentication on component mount
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  });
  const [activeTab, setActiveTab] = useState('home');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [recentChanges, setRecentChanges] = useState(() => {
    try { return JSON.parse(localStorage.getItem('adminRecentChanges') || '[]'); } catch { return []; }
  });
  const recordChange = (title, category) => {
    const changes = [{ title, category, date: new Date().toISOString() }, ...recentChanges].slice(0, 8);
    setRecentChanges(changes);
    try { localStorage.setItem('adminRecentChanges', JSON.stringify(changes)); } catch { /* History is optional when storage is unavailable. */ }
  };
  const navigateSection = id => { setActiveTab(id); setSidebarOpen(false); };
  const currentSection = sections.find(section => section.id === activeTab);

  useEffect(() => {
    setAdminDashboard(isAuthenticated);
    return () => setAdminDashboard(false);
  }, [isAuthenticated, setAdminDashboard]);

  useEffect(() => {
    if (!sidebarOpen) return;
    const close = event => { if (event.key === 'Escape') setSidebarOpen(false); };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [sidebarOpen]);
  
  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: '',
    summary: '',
    content: '',
    published_date: new Date().toISOString().split('T')[0],
    images: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Documents state
  const [documents, setDocuments] = useState([]);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const [documentForm, setDocumentForm] = useState({
    title: '',
    description: '',
    category: '',
    file_url: '',
    file_name: '',
    file_size: '',
    uploaded_date: new Date().toISOString().split('T')[0]
  });

  // Employee Duties state
  const [employeeDuties, setEmployeeDuties] = useState(null);
  const [showDutiesForm, setShowDutiesForm] = useState(false);
  const [dutiesForm, setDutiesForm] = useState({
    duty_dates: '',
    employees: []
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchAnnouncements();
      fetchDocuments();
      fetchEmployeeDuties();
    }
  }, [isAuthenticated]);

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/posts');
      const result = await response.json();
      if (result.success) {
        setAnnouncements(result.data);
      } else { alert('Nie udało się pobrać aktualności.'); }
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/documents');
      const result = await response.json();
      if (result.success) {
        setDocuments(result.data);
      } else { alert('Nie udało się pobrać dokumentów.'); }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Fetch employee duties
  const fetchEmployeeDuties = async () => {
    try {
      const response = await fetch('/api/employee-duties');
      const result = await response.json();
      if (result.success && result.data) {
        setEmployeeDuties(result.data);
        setDutiesForm({
          duty_dates: result.data.duty_dates,
          employees: result.data.employees
        });
      }
    } catch (error) {
      console.error('Error fetching employee duties:', error);
    }
  };

  // Handle employee duties form submission
  const handleDutiesSubmit = async (e) => {
    e.preventDefault();
    if (!employeeDuties) return;

    try {
      const response = await fetch(`/api/employee-duties/${employeeDuties.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dutiesForm)
      });

      const result = await response.json();
      if (result.success) {
        recordChange('Dyżury pracowników', 'residents');
        fetchEmployeeDuties();
        setShowDutiesForm(false);
        alert('Dyżury zaktualizowane!');
      }
    } catch (error) {
      console.error('Error saving employee duties:', error);
      alert('Błąd podczas zapisywania dyżurów');
    }
  };

  // Add employee to duties list
  const addEmployee = () => {
    setDutiesForm({
      ...dutiesForm,
      employees: [...dutiesForm.employees, { role: '', phone: '' }]
    });
  };

  // Remove employee from duties list
  const removeEmployee = (index) => {
    const newEmployees = dutiesForm.employees.filter((_, i) => i !== index);
    setDutiesForm({
      ...dutiesForm,
      employees: newEmployees
    });
  };

  // Update employee in duties list
  const updateEmployee = (index, field, value) => {
    const newEmployees = [...dutiesForm.employees];
    newEmployees[index][field] = value;
    setDutiesForm({
      ...dutiesForm,
      employees: newEmployees
    });
  };

  // Handle multiple images selection
  const handleImagesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);
      
      // Create previews for all selected images
      const previews = [];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Upload multiple images
  const uploadImages = async () => {
    if (selectedImages.length === 0) return [];

    setUploadingImages(true);
    const uploadedImages = [];

    try {
      for (const file of selectedImages) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('/api/upload/announcement-image', {
          method: 'POST',
          body: formData
        });

        const result = await response.json();
        if (response.ok && result.success) {
          uploadedImages.push({
            url: result.imageUrl,
            alt: ''
          });
        } else { throw new Error('Image upload failed'); }
      }
      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    } finally {
      setUploadingImages(false);
    }
  };

  // Remove image from form
  const removeImage = (index) => {
    const newImages = [...announcementForm.images];
    newImages.splice(index, 1);
    setAnnouncementForm({...announcementForm, images: newImages});
  };

  // Update image alt text
  const updateImageAlt = (index, alt) => {
    const newImages = [...announcementForm.images];
    newImages[index].alt = alt;
    setAnnouncementForm({...announcementForm, images: newImages});
  };

  // Handle announcement form submission
  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      let images = [...announcementForm.images];

      // Upload new images if selected
      if (selectedImages.length > 0) {
        const uploadedImages = await uploadImages();
        images = [...images, ...uploadedImages];
      }

      const url = editingAnnouncement 
        ? `/api/posts/${editingAnnouncement.id}`
        : '/api/posts';
      const method = editingAnnouncement ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...announcementForm,
          images: images,
        })
      });

      const result = await response.json();
      if (result.success) {
        recordChange(announcementForm.title, 'announcements');
        fetchAnnouncements();
        resetAnnouncementForm();
        alert(editingAnnouncement ? 'Ogłoszenie zaktualizowane!' : 'Ogłoszenie dodane!');
      } else { throw new Error('Announcement save failed'); }
    } catch (error) {
      console.error('Error saving announcement:', error);
      alert('Błąd podczas zapisywania ogłoszenia');
    }
  };

  // Handle document form submission
  const handleDocumentSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingDocument 
        ? `/api/documents/${editingDocument.id}`
        : '/api/documents';
      const method = editingDocument ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...documentForm,
          file_size: parseInt(documentForm.file_size) || 0
        })
      });

      const result = await response.json();
      if (result.success) {
        recordChange(documentForm.title, 'documents');
        fetchDocuments();
        resetDocumentForm();
        alert(editingDocument ? 'Dokument zaktualizowany!' : 'Dokument dodany!');
      } else { throw new Error('Document save failed'); }
    } catch (error) {
      console.error('Error saving document:', error);
      alert('Błąd podczas zapisywania dokumentu');
    }
  };

  // Delete announcement
  const handleDeleteAnnouncement = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć to ogłoszenie?')) return;
    
    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        recordChange(announcements.find(item => item.id === id)?.title || 'Usunięty artykuł', 'announcements');
        fetchAnnouncements();
        alert('Ogłoszenie usunięte!');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      alert('Błąd podczas usuwania ogłoszenia');
    }
  };

  // Delete document
  const handleDeleteDocument = async (id) => {
    if (!confirm('Czy na pewno chcesz usunąć ten dokument?')) return;
    
    try {
      const response = await fetch(`/api/documents/${id}`, { method: 'DELETE' });
      const result = await response.json();
      if (result.success) {
        recordChange(documents.find(item => item.id === id)?.title || 'Usunięty dokument', 'documents');
        fetchDocuments();
        alert('Dokument usunięty!');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Błąd podczas usuwania dokumentu');
    }
  };

  // Edit announcement
  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      category: announcement.category,
      summary: announcement.summary,
      content: announcement.content,
      published_date: announcement.published_date?.slice(0, 10),
      images: announcement.images || []
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setShowAnnouncementForm(true);
  };

  // Edit document
  const handleEditDocument = (document) => {
    setEditingDocument(document);
    setDocumentForm({
      title: document.title,
      description: document.description,
      category: document.category,
      file_url: document.file_url,
      file_name: document.file_name,
      file_size: document.file_size?.toString() || '',
      uploaded_date: document.uploaded_date?.slice(0, 10)
    });
    setShowDocumentForm(true);
  };

  // Reset forms
  const resetAnnouncementForm = () => {
    setAnnouncementForm({
      title: '',
      category: '',
      summary: '',
      content: '',
      published_date: new Date().toISOString().split('T')[0],
      images: []
    });
    setEditingAnnouncement(null);
    setShowAnnouncementForm(false);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  const resetDocumentForm = () => {
    setDocumentForm({
      title: '',
      description: '',
      category: '',
      file_url: '',
      file_name: '',
      file_size: '',
      uploaded_date: new Date().toISOString().split('T')[0]
    });
    setEditingDocument(null);
    setShowDocumentForm(false);
  };

  // Simple login (for demonstration - in production use proper authentication)
  const handleLogin = (event) => {
    event.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      // Store authentication in sessionStorage (persists during browser session only)
      sessionStorage.setItem('adminAuthenticated', 'true');
      setPassword('');
      setLoginError('');
      setActiveTab('home');
    } else {
      setLoginError('Nieprawidłowe hasło. Spróbuj ponownie.');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
    // Remove authentication from sessionStorage
    sessionStorage.removeItem('adminAuthenticated');
    setSidebarOpen(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="administration-page admin-login-page">
        <div className="admin-login-container">
          <div className="admin-lock-icon"><AdminIcon name="lock" width="27" height="27" /></div>
          <p className="admin-login-eyebrow">OSIEDLE ŁAZARZ · PANEL ADMINISTRACYJNY</p>
          <header className="admin-login-heading"><h1>Administracja</h1><p>Panel administracyjny – zarządzanie treścią portalu</p></header>
          <div className="login-card">
            <div className="admin-protected"><h2>Strefa Chroniona</h2><p>Ta sekcja jest dostępna tylko dla autoryzowanych administratorów. Zaloguj się, aby zarządzać treścią portalu.</p></div>
            <form onSubmit={handleLogin}>
              <h3>Logowanie Administratora</h3><p className="login-description">Wprowadź hasło, aby przejść do panelu administracyjnego.</p>
              <div className="form-group"><label htmlFor="admin-password">Hasło administratora</label><input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} aria-invalid={!!loginError} aria-describedby={loginError ? 'admin-login-error' : undefined} /></div>
              {loginError && <p className="admin-feedback" id="admin-login-error" role="alert">{loginError}</p>}
              <button type="submit" className="login-btn"><AdminIcon name="lock" width="18" height="18" />Zaloguj się</button>
              <p className="demo-note"><strong>Wersja demonstracyjna</strong><br />Użyj hasła <code>admin123</code></p>
            </form>
          </div>
          <p className="admin-access-note">Dostęp wyłącznie dla upoważnionych osób</p>
          <Link className="admin-return" to="/">← Wróć do strony głównej</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="administration-page authenticated">
      <aside className={`admin-sidebar ${sidebarOpen ? 'is-open' : ''}`} id="admin-sidebar" aria-label="Nawigacja administracyjna">
        <Link to="/" className="admin-brand"><AdminIcon name="home" width="30" height="30" /><span>Osiedle Łazarz<small>Panel administracyjny</small></span></Link>
        <button className="admin-drawer-close" onClick={() => setSidebarOpen(false)} aria-label="Zamknij menu"><AdminIcon name="close" /></button>
        <p className="admin-nav-label">ZARZĄDZANIE PORTALEM</p>
        <nav>{sections.map(section => <button key={section.id} onClick={() => navigateSection(section.id)} className={activeTab === section.id ? 'active' : ''} aria-current={activeTab === section.id ? 'page' : undefined}><AdminIcon name={section.icon || section.id} /><span>{section.title}</span></button>)}</nav>
        <div className="admin-sidebar-bottom"><span>Administrator<small>Wersja demonstracyjna</small></span><button onClick={handleLogout}><AdminIcon name="logout" />Wyloguj się</button></div>
      </aside>
      {sidebarOpen && <button className="admin-drawer-backdrop" aria-label="Zamknij menu" onClick={() => setSidebarOpen(false)} />}
      <div className="admin-workspace">
        <div className="admin-topbar"><button className="admin-menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)} aria-expanded={sidebarOpen} aria-controls="admin-sidebar"><AdminIcon name="menu" />Menu</button><span>Administracja <span aria-hidden="true">/</span> {currentSection.title}</span><Link to="/">Zobacz portal <AdminIcon name="arrow" width="16" height="16" /></Link></div>
        <div className="admin-main-inner">
          <header className="admin-welcome"><p className="admin-eyebrow">OSIEDLE ŁAZARZ · PANEL ADMINISTRACYJNY</p><h1>{activeTab === 'home' ? 'Witaj w panelu administracyjnym' : currentSection.title}</h1><p>{activeTab === 'home' ? 'Zarządzaj treścią portalu Osiedla Łazarz w jednym miejscu.' : currentSection.description}</p></header>
          {activeTab === 'home' && <>
            <div className="admin-grid">{sections.slice(1, 7).map(section => <button className="admin-management-card" key={section.id} onClick={() => navigateSection(section.id)}><span className="admin-card-icon"><AdminIcon name={section.icon || section.id} /></span><h2>{section.title}</h2><p>{section.description}</p><span className="admin-card-link">Zarządzaj <AdminIcon name="arrow" width="18" height="18" /></span></button>)}</div>
            <section className="admin-recent"><header><h2>Ostatnie zmiany</h2><span>Historia w tej przeglądarce</span></header>{recentChanges.length ? <ul>{recentChanges.map((change, index) => <li key={`${change.date}-${index}`}><span className="admin-recent-icon"><AdminIcon name="documents" width="18" height="18" /></span><div><strong>{change.title}</strong><small>{sections.find(section => section.id === change.category)?.title || change.category}</small></div><time dateTime={change.date}>{new Date(change.date).toLocaleString('pl-PL', { dateStyle: 'medium', timeStyle: 'short' })}</time></li>)}</ul> : <p className="admin-empty-history">Nie zapisano jeszcze żadnych zmian. Zacznij od wybrania sekcji powyżej.</p>}</section>
          </>}
          {['notices', 'gallery', 'events', 'council', 'residents'].includes(activeTab) && <AdminSections key={activeTab} section={activeTab} onChange={recordChange} />}
          {activeTab === 'settings' && <section className="admin-form"><h2>Bezpieczeństwo panelu</h2><p>Panel działa w trybie demonstracyjnym. Logowanie jest zapamiętywane tylko na czas sesji przeglądarki. Przed wdrożeniem produkcyjnym wymagane jest uwierzytelnianie i autoryzacja po stronie serwera dla wszystkich operacji zapisu.</p><button className="cancel-btn" onClick={handleLogout}>Zakończ sesję</button></section>}

      {/* Announcements Tab */}
      {activeTab === 'announcements' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>Artykuły i aktualności</h2>
            <button 
              onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
              className="add-btn"
            >
              {showAnnouncementForm ? '✕ Anuluj' : '+ Dodaj nowy'}
            </button>
          </div>

          {showAnnouncementForm && (
            <form onSubmit={handleAnnouncementSubmit} className="admin-form">
              <h3>{editingAnnouncement ? 'Edytuj Ogłoszenie' : 'Nowe Ogłoszenie'}</h3>
              
              <div className="form-group">
                <label>Tytuł *</label>
                <input
                  type="text"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Kategoria *</label>
                <input
                  type="text"
                  value={announcementForm.category}
                  onChange={(e) => setAnnouncementForm({...announcementForm, category: e.target.value})}
                  placeholder="np. Spotkanie, Konserwacja, Regulamin"
                  required
                />
              </div>

              <div className="form-group">
                <label>Podsumowanie</label>
                <textarea
                  value={announcementForm.summary}
                  onChange={(e) => setAnnouncementForm({...announcementForm, summary: e.target.value})}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Treść *</label>
                <textarea
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                  rows="5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Zdjęcia (możesz wybrać wiele naraz)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesSelect}
                />

                {/* Existing images (when editing or already uploaded) */}
                {announcementForm.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '12px' }}>
                    {announcementForm.images.map((img, idx) => (
                      <div key={idx} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '8px', width: '160px' }}>
                        <img src={img.url} alt={img.alt || 'Podgląd'} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px' }} />
                        <input
                          type="text"
                          value={img.alt}
                          onChange={(e) => updateImageAlt(idx, e.target.value)}
                          placeholder="Opis alternatywny"
                          style={{ width: '100%', marginTop: '6px', fontSize: '12px', padding: '4px' }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="delete-btn"
                          style={{ width: '100%', marginTop: '6px', padding: '4px', fontSize: '12px' }}
                        >
                          🗑️ Usuń
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Previews of newly selected (not yet uploaded) images */}
                {imagePreviews.length > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <p style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>Nowe zdjęcia do przesłania:</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {imagePreviews.map((preview, idx) => (
                        <img
                          key={idx}
                          src={preview}
                          alt="Podgląd nowego zdjęcia"
                          style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '6px', border: '2px dashed #aaa' }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Data Publikacji *</label>
                <input
                  type="date"
                  value={announcementForm.published_date}
                  onChange={(e) => setAnnouncementForm({...announcementForm, published_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={uploadingImages}>
                  {uploadingImages ? 'Przesyłanie...' : (editingAnnouncement ? 'Zaktualizuj' : 'Dodaj')} Ogłoszenie
                </button>
                <button type="button" onClick={resetAnnouncementForm} className="cancel-btn">
                  Anuluj
                </button>
              </div>
            </form>
          )}

          <div className="items-list">
            <h3>Wszystkie Ogłoszenia ({announcements.length})</h3>
            {announcements.map((announcement) => (
              <div key={announcement.id} className="item-card">
                <div className="item-info">
                  {announcement.images && announcement.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                      {announcement.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={img.alt || announcement.title}
                          style={{ maxWidth: '150px', borderRadius: '8px' }}
                        />
                      ))}
                    </div>
                  )}
                  <h4>{announcement.title}</h4>
                  <p className="item-meta">
                    <span className="badge">{announcement.category}</span>
                    <span>{new Date(announcement.published_date).toLocaleDateString('pl-PL')}</span>
                  </p>
                  <p className="item-summary">{announcement.summary}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEditAnnouncement(announcement)} className="edit-btn">
                    ✏️ Edytuj
                  </button>
                  <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="delete-btn">
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>Zarządzanie Dokumentami</h2>
            <button 
              onClick={() => setShowDocumentForm(!showDocumentForm)}
              className="add-btn"
            >
              {showDocumentForm ? '✕ Anuluj' : '+ Dodaj nowy'}
            </button>
          </div>

          {showDocumentForm && (
            <form onSubmit={handleDocumentSubmit} className="admin-form">
              <h3>{editingDocument ? 'Edytuj Dokument' : 'Nowy Dokument'}</h3>
              
              <div className="form-group">
                <label>Tytuł *</label>
                <input
                  type="text"
                  value={documentForm.title}
                  onChange={(e) => setDocumentForm({...documentForm, title: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label>Opis</label>
                <textarea
                  value={documentForm.description}
                  onChange={(e) => setDocumentForm({...documentForm, description: e.target.value})}
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Kategoria *</label>
                <input
                  type="text"
                  value={documentForm.category}
                  onChange={(e) => setDocumentForm({...documentForm, category: e.target.value})}
                  placeholder="np. Regulaminy Ogólne, Formularze, Raporty Finansowe"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-pdf-upload">Prześlij lub zastąp plik PDF (maks. 10 MB)</label>
                <input id="admin-pdf-upload" type="file" accept="application/pdf,.pdf" disabled={uploadingDocument} onChange={async event => {
                  const file = event.target.files[0];
                  if (!file) return;
                  if (file.type !== 'application/pdf' || file.size > 10 * 1024 * 1024) { alert('Wybierz plik PDF do 10 MB.'); return; }
                  const body = new FormData(); body.append('document', file);
                  setUploadingDocument(true);
                  try {
                    const response = await fetch('/api/upload/document', { method: 'POST', body });
                    const result = await response.json();
                    if (!response.ok || !result.success) throw new Error();
                    setDocumentForm(previous => ({ ...previous, ...result.data }));
                  } catch { alert('Nie udało się przesłać pliku PDF.'); }
                  finally { setUploadingDocument(false); }
                }} />
                {uploadingDocument && <p role="status">Przesyłanie pliku PDF…</p>}
              </div>
              <div className="form-group">
                <label>URL Pliku *</label>
                <input
                  type="text"
                  value={documentForm.file_url}
                  onChange={(e) => setDocumentForm({...documentForm, file_url: e.target.value})}
                  placeholder="/documents/nazwa-pliku.pdf"
                  required
                />
              </div>

              <div className="form-group">
                <label>Nazwa Pliku *</label>
                <input
                  type="text"
                  value={documentForm.file_name}
                  onChange={(e) => setDocumentForm({...documentForm, file_name: e.target.value})}
                  placeholder="nazwa-pliku.pdf"
                  required
                />
              </div>

              <div className="form-group">
                <label>Rozmiar Pliku (bajty)</label>
                <input
                  type="number"
                  value={documentForm.file_size}
                  onChange={(e) => setDocumentForm({...documentForm, file_size: e.target.value})}
                  placeholder="245000"
                />
              </div>

              <div className="form-group">
                <label>Data Przesłania *</label>
                <input
                  type="date"
                  value={documentForm.uploaded_date}
                  onChange={(e) => setDocumentForm({...documentForm, uploaded_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn" disabled={uploadingDocument}>
                  {editingDocument ? 'Zaktualizuj' : 'Dodaj'} Dokument
                </button>
                <button type="button" onClick={resetDocumentForm} className="cancel-btn">
                  Anuluj
                </button>
              </div>
            </form>
          )}

          <div className="items-list">
            <h3>Wszystkie Dokumenty ({documents.length})</h3>
            {documents.map((document) => (
              <div key={document.id} className="item-card">
                <div className="item-info">
                  <h4>{document.title}</h4>
                  <p className="item-meta">
                    <span className="badge">{document.category}</span>
                    <span>{new Date(document.uploaded_date).toLocaleDateString('pl-PL')}</span>
                  </p>
                  <p className="item-summary">{document.description}</p>
                  <p className="item-file">📎 {document.file_name}</p>
                </div>
                <div className="item-actions">
                  <button onClick={() => handleEditDocument(document)} className="edit-btn">
                    ✏️ Edytuj
                  </button>
                  <button onClick={() => handleDeleteDocument(document.id)} className="delete-btn">
                    🗑️ Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employee Duties Tab */}
      {activeTab === 'residents' && (
        <div className="admin-content">
          <div className="content-header">
            <h2>Zarządzanie Dyżurami Pracowników</h2>
            <button 
              onClick={() => setShowDutiesForm(!showDutiesForm)}
              className="add-btn"
            >
              {showDutiesForm ? '✕ Anuluj' : '✏️ Edytuj Dyżury'}
            </button>
          </div>

          {showDutiesForm && employeeDuties && (
            <form onSubmit={handleDutiesSubmit} className="admin-form">
              <h3>Edytuj Dyżury Domowe Pracowników</h3>
              
              <div className="form-group">
                <label>Daty Dyżurów *</label>
                <input
                  type="text"
                  value={dutiesForm.duty_dates}
                  onChange={(e) => setDutiesForm({...dutiesForm, duty_dates: e.target.value})}
                  placeholder="np. 28-29.03.2026"
                  required
                />
              </div>

              <div className="form-group">
                <label>Pracownicy na Dyżurze</label>
                {dutiesForm.employees.map((employee, index) => (
                  <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={employee.role}
                      onChange={(e) => updateEmployee(index, 'role', e.target.value)}
                      placeholder="Stanowisko (np. Instalator)"
                      style={{ flex: 1 }}
                      required
                    />
                    <input
                      type="text"
                      value={employee.phone}
                      onChange={(e) => updateEmployee(index, 'phone', e.target.value)}
                      placeholder="Telefon (np. 501 327 815)"
                      style={{ flex: 1 }}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => removeEmployee(index)}
                      className="delete-btn"
                      style={{ padding: '8px 12px' }}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addEmployee}
                  className="add-btn"
                  style={{ marginTop: '10px' }}
                >
                  + Dodaj Pracownika
                </button>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  Zaktualizuj Dyżury
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowDutiesForm(false);
                    fetchEmployeeDuties(); // Reset form to original values
                  }} 
                  className="cancel-btn"
                >
                  Anuluj
                </button>
              </div>
            </form>
          )}

          {!showDutiesForm && employeeDuties && (
            <div className="items-list">
              <h3>Aktualne Dyżury</h3>
              <div className="item-card">
                <div className="item-info">
                  <h4>Dyżury domowe pracowników osiedla</h4>
                  <p className="item-meta">
                    <span className="badge">Daty: {employeeDuties.duty_dates}</span>
                  </p>
                  <div style={{ marginTop: '15px' }}>
                    <strong>Pracownicy na dyżurze:</strong>
                    <div style={{ marginTop: '10px' }}>
                      {employeeDuties.employees.map((employee, index) => (
                        <div key={index} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                          <span style={{ fontWeight: '500' }}>{employee.role}:</span>{' '}
                            <a href={`tel:${employee.phone.replace(/\s/g, '')}`} style={{ color: '#15552f' }}>
                            {employee.phone}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
        </div>
      </div>
    </div>
  );
}

export default Administration;
