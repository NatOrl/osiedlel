import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';
import './LatestNews.css';

const NEWS_COUNT = 4; // 1 featured article + 3 smaller cards
const FEATURED_DESCRIPTION_LENGTH = 230;
const CARD_DESCRIPTION_LENGTH = 110;
const PLACEHOLDER_IMAGE = '/uploads/announcements/placeholder.jpg';
const FEATURED_DEFAULT_CATEGORY = 'Wyróżnione'; // shown when the featured post has no category
const DEFAULT_CATEGORY = 'Życie osiedla'; // shown when a post has no category

function ArrowIcon({ size = 14 }) {
  return (
    <svg
      className="news-arrow"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="13 6 19 12 13 18" />
    </svg>
  );
}

const truncate = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength).trimEnd()}…`;
};

function LatestNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const fetchNews = async () => {
      try {
        const response = await fetch('/api/posts');
        const result = await response.json();
        if (cancelled) return;
        if (response.ok && result.success) {
          setNews(result.data.slice(0, NEWS_COUNT));
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching latest news:', err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  const renderImage = (item) => {
    const thumbnail = item.images && item.images.length > 0 ? item.images[0] : null;
    return (
      <img
        src={thumbnail?.url || PLACEHOLDER_IMAGE}
        alt={thumbnail?.alt || item.title}
        loading="lazy"
        onError={handleImageError}
      />
    );
  };

  // The newest article is featured, the following ones are shown as smaller cards
  const [featured, ...others] = news;

  return (
    <section className="news-section" aria-labelledby="news-title">
      <div className="news-inner">
        <header className="news-header">
          <p className="news-eyebrow">Życie naszego osiedla</p>
          <h2 id="news-title" className="news-heading">Aktualności</h2>
          <p className="news-subtitle">Bądź na bieżąco z tym, co dzieje się na naszym osiedlu.</p>
          <span className="news-underline" aria-hidden="true" />
        </header>

        {loading && <p className="news-status">Ładowanie aktualności...</p>}
        {error && <p className="news-status">Nie udało się załadować aktualności. Spróbuj ponownie później.</p>}
        {!loading && !error && news.length === 0 && (
          <p className="news-status">Brak aktualności do wyświetlenia.</p>
        )}

        {featured && (
          <article className="news-featured">
            <div className="news-featured-media">{renderImage(featured)}</div>
            <div className="news-featured-body">
              <p className="news-meta">
                <span className="news-meta-category">
                  {featured.category || FEATURED_DEFAULT_CATEGORY}
                </span>
                <span className="news-meta-dot" aria-hidden="true" />
                <time className="news-meta-date" dateTime={featured.published_date}>
                  {formatDate(featured.published_date)}
                </time>
              </p>
              <h3 className="news-featured-title">{featured.title}</h3>
              <p className="news-featured-description">
                {truncate(featured.summary || featured.content, FEATURED_DESCRIPTION_LENGTH)}
              </p>
              {/* The link covers the whole card (see .news-link::after) */}
              <Link to={`/announcements#post-${featured.id}`} className="news-link news-link-featured">
                <span>Czytaj więcej</span>
                <ArrowIcon size={16} />
                <span className="news-sr-only">: {featured.title}</span>
              </Link>
            </div>
          </article>
        )}

        {others.length > 0 && (
          <div className="news-grid">
            {others.map((item) => (
              <article key={item.id} className="news-card">
                <div className="news-thumbnail">{renderImage(item)}</div>
                <div className="news-content">
                  <p className="news-meta news-meta-small">
                    <span className="news-meta-category">{item.category || DEFAULT_CATEGORY}</span>
                    <span className="news-meta-dot" aria-hidden="true" />
                    <time className="news-meta-date" dateTime={item.published_date}>
                      {formatDate(item.published_date)}
                    </time>
                  </p>
                  <h3 className="news-title">{item.title}</h3>
                  <p className="news-description">
                    {truncate(item.summary || item.content, CARD_DESCRIPTION_LENGTH)}
                  </p>
                  <Link to={`/announcements#post-${item.id}`} className="news-link">
                    <span>Czytaj więcej</span>
                    <ArrowIcon />
                    <span className="news-sr-only">: {item.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {news.length > 0 && (
          <div className="news-all-link">
            <Link to="/announcements" className="news-all-button">
              Zobacz wszystkie aktualności →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

export default LatestNews;

