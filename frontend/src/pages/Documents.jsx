import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Documents.css';

function DocumentIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </svg>
  );
}

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/documents');
      const result = await response.json();
      
      if (result.success) {
        setDocuments(result.data);
      } else {
        setError('Nie udało się pobrać dokumentów');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Błąd połączenia z serwerem');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pl-PL', options);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(0)} KB`;
    const mb = kb / 1024;
    return `${mb.toFixed(1)} MB`;
  };

  // Group documents by category
  const groupedDocuments = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {});

  const documentCategories = Object.keys(groupedDocuments).map((category) => ({
    name: category,
    documents: groupedDocuments[category]
  }));

  const pageHeader = (
    <header className="page-header">
      <div className="header-inner">
        <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
          <Link to="/" className="breadcrumb-link">
            Strona główna
          </Link>
          <span className="breadcrumb-separator" aria-hidden="true">
            ›
          </span>
          <span className="breadcrumb-current" aria-current="page">Dokumenty</span>
        </nav>

        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">Dokumenty</h1>
            <div className="accent-line" aria-hidden="true"></div>
            <p className="page-description">
              Uzyskaj dostęp do oficjalnych dokumentów, formularzy i zasobów dla społeczności
            </p>
          </div>

        </div>
      </div>
    </header>
  );

  if (loading) {
    return (
      <div className="documents-page">
        {pageHeader}
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Ładowanie dokumentów...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="documents-page">
        {pageHeader}
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Błąd ładowania dokumentów</h3>
          <p>{error}</p>
          <button onClick={fetchDocuments} className="retry-btn">
            Spróbuj ponownie
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="documents-page">
      {pageHeader}

      <div className="documents-container">
        {documentCategories.map((category) => (
          <section key={category.name} className="document-category">
            <div className="category-heading">
              <DocumentIcon className="category-icon" />
              <h2 className="category-title">{category.name}</h2>
            </div>
            <div className="documents-grid">
              {category.documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="card-content">
                    <div className="document-icon-container">
                      <DocumentIcon className="document-icon" />
                    </div>
                    <div className="document-info">
                      <h3 className="document-title">{doc.title}</h3>
                      <p className="document-description">{doc.description}</p>
                      <div className="document-meta">
                        <span className="document-date">
                          Zaktualizowano: <time dateTime={doc.uploaded_date}>{formatDate(doc.uploaded_date)}</time>
                        </span>
                        <span className="document-size">{formatFileSize(doc.file_size)}</span>
                      </div>
                    </div>
                  </div>
                  <a 
                    href={doc.file_url} 
                    download={doc.file_name}
                    className="download-button"
                    aria-label={`Pobierz: ${doc.title}`}
                  >
                    <svg className="download-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
                      <path d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" />
                    </svg>
                    <span className="button-text">Pobierz</span>
                  </a>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {documentCategories.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📂</span>
          <h3>Brak dostępnych dokumentów</h3>
          <p>Dokumenty zostaną wkrótce dodane. Sprawdź ponownie później.</p>
        </div>
      )}
    </div>
  );
}

export default Documents;
