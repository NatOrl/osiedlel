import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import ImageCarousel from '../components/ImageCarousel';
import ImageLightbox from '../components/ImageLightbox';
import AnnouncementContent from '../components/AnnouncementContent';
import { formatDate, parseDate } from '../utils/formatDate';
import './Announcements.css';

function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [lightbox, setLightbox] = useState(null); // { images, index }
  const [expandedAnnouncements, setExpandedAnnouncements] = useState({});
  const ANNOUNCEMENTS_PER_PAGE = 5;
  const location = useLocation();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Support deep links from the home page ("Czytaj więcej" -> /announcements#post-<id>):
  // switch to the page containing the post and scroll to it.
  useEffect(() => {
    if (loading || announcements.length === 0) return;
    const match = location.hash.match(/^#post-(\d+)$/);
    if (!match) return;

    const index = announcements.findIndex((item) => String(item.id) === match[1]);
    if (index === -1) return;

    const targetPage = Math.floor(index / ANNOUNCEMENTS_PER_PAGE);
    setCurrentPage(targetPage);

    const timer = setTimeout(() => {
      document.getElementById(`post-${match[1]}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
    return () => clearTimeout(timer);
  }, [loading, announcements, location.hash]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/posts');
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch announcements');
      }
      
      if (result.success) {
        setAnnouncements([...result.data].sort((a, b) =>
          (parseDate(b.published_date)?.getTime() || 0) -
          (parseDate(a.published_date)?.getTime() || 0)
        ));
      } else {
        throw new Error(result.error || 'Failed to fetch announcements');
      }
    } catch (err) {
      console.error('Error fetching announcements:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(announcements.length / ANNOUNCEMENTS_PER_PAGE);
  const startIndex = currentPage * ANNOUNCEMENTS_PER_PAGE;
  const endIndex = startIndex + ANNOUNCEMENTS_PER_PAGE;
  const currentAnnouncements = announcements.slice(startIndex, endIndex);

  const goToOlderAnnouncements = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToNewerAnnouncements = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openLightbox = (images, index) => {
    setLightbox({ images, index });
  };

  const closeLightbox = () => {
    setLightbox(null);
  };

  const navigateLightbox = (direction) => {
    setLightbox((prev) => {
      if (!prev) return prev;
      const total = prev.images.length;
      const newIndex = (prev.index + direction + total) % total;
      return { ...prev, index: newIndex };
    });
  };

  return (
    <div className="announcements-page">
      <header className="page-header">
        <div className="header-inner">
          <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
            <Link to="/" className="breadcrumb-link">
              Strona główna
            </Link>
            <span className="breadcrumb-separator" aria-hidden="true">
              ›
            </span>
            <span className="breadcrumb-current" aria-current="page">Ogłoszenia</span>
          </nav>

          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Ogłoszenia</h1>
              <div className="accent-line" aria-hidden="true"></div>
              <p className="page-description">
                Bądź na bieżąco z najnowszymi wiadomościami i aktualizacjami od administracji osiedla.
              </p>
            </div>

            <div
              className="header-icon"
              aria-hidden="true"
            >
              <svg
                width="76"
                height="76"
                viewBox="0 0 80 80"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M18 32h14l28-13v42L32 48H18a5 5 0 0 1-5-5v-6a5 5 0 0 1 5-5ZM32 32v16m-10 0 5 17h10l-5-17M67 29l6-4m-5 15h8m-9 11 6 4" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Ładowanie ogłoszeń...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <h3>Błąd ładowania ogłoszeń</h3>
          <p>{error}</p>
          <button onClick={fetchAnnouncements} className="retry-btn">
            Spróbuj ponownie
          </button>
        </div>
      )}

      {!loading && !error && announcements.length > 0 && (
        <>
          <div className="announcements-list">
            {currentAnnouncements.map((announcement) => (
              <article
                key={announcement.id}
                id={`post-${announcement.id}`}
                className={`announcement-card${announcement.images?.length ? '' : ' announcement-card--text-only'}`}
                aria-labelledby={`post-title-${announcement.id}`}
              >
                {announcement.images && announcement.images.length > 0 && (
                  <div className="announcement-gallery">
                    <ImageCarousel
                      images={announcement.images}
                      title={announcement.title}
                      onImageClick={(index) => openLightbox(announcement.images, index)}
                    />
                  </div>
                )}

                <div className="announcement-details">
                  <div className="announcement-date">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="5" width="18" height="16" rx="2" />
                      <path d="M16 3v4M8 3v4M3 11h18" />
                    </svg>
                    <time dateTime={announcement.published_date}>{formatDate(announcement.published_date)}</time>
                  </div>
                  <div className="announcement-heading">
                    <h2 id={`post-title-${announcement.id}`} className="announcement-title">{announcement.title}</h2>
                    {announcement.category && (
                      ['ważne', 'pilne'].includes(announcement.category.trim().toLocaleLowerCase('pl-PL')) ? (
                        <span className="announcement-badge">WAŻNE</span>
                      ) : (
                        <span className="announcement-category">{announcement.category}</span>
                      )
                    )}
                  </div>
                  <AnnouncementContent
                    id={announcement.id}
                    content={announcement.content}
                    expanded={Boolean(expandedAnnouncements[announcement.id])}
                    onToggle={() => setExpandedAnnouncements((previous) => ({
                      ...previous,
                      [announcement.id]: !previous[announcement.id],
                    }))}
                  />
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button 
                className="pagination-btn pagination-btn-prev"
                onClick={goToNewerAnnouncements}
                disabled={currentPage === 0}
              >
                &lt; Późniejsze
              </button>
              <button 
                className="pagination-btn pagination-btn-next"
                onClick={goToOlderAnnouncements}
                disabled={currentPage === totalPages - 1}
              >
                wcześniejsze &gt;
              </button>
            </div>
          )}
        </>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div className="empty-state">
          <span className="empty-icon">📭</span>
          <h3>Brak ogłoszeń</h3>
          <p>Sprawdź ponownie później, aby zobaczyć aktualizacje od administracji osiedla.</p>
        </div>
      )}

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}

export default Announcements;
