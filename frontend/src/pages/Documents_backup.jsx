import { useState, useEffect } from 'react';
import './Documents.css';

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

  if (loading) {
    return (
      <div className="documents-page">
        <div className="page-header">
          <h1 className="page-title">Dokumenty</h1>
          <p className="page-description">
            Uzyskaj dostęp do oficjalnych dokumentów, formularzy i zasobów dla społeczności
          </p>
        </div>
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
        <div className="page-header">
          <h1 className="page-title">Dokumenty</h1>
          <p className="page-description">
            Uzyskaj dostęp do oficjalnych dokumentów, formularzy i zasobów dla społeczności
          </p>
        </div>
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
      <div className="page-header">
        <h1 className="page-title">Dokumenty</h1>
        <p className="page-description">
          Uzyskaj dostęp do oficjalnych dokumentów, formularzy i zasobów dla społeczności
        </p>
      </div>

      <div className="documents-container">
        {documentCategories.map((category, idx) => (
          <section key={idx} className="document-category">
            <h2 className="category-title">{category.name}</h2>
            <div className="documents-grid">
              {category.documents.map((doc) => (
                <div key={doc.id} className="document-card">
                  <div className="document-icon">📄</div>
                  <div className="document-info">
                    <h3 className="document-title">{doc.title}</h3>
                    <p className="document-description">{doc.description}</p>
                    <div className="document-meta">
                      <span className="document-date">
                        Zaktualizowano: {formatDate(doc.uploaded_date)}
                      </span>
                      <span className="document-size"> • {formatFileSize(doc.file_size)}</span>
                    </div>
                  </div>
                  <a 
                    href={doc.file_url} 
                    download={doc.file_name}
                    className="download-btn" 
                    title="Pobierz dokument"
                  >
                    <span>⬇️</span>
                    <span>Pobierz</span>
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
