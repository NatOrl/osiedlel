import { Link } from 'react-router-dom';
import './CommunitySection.css';

const INTRO_TEXT =
  'Osiedle Łazarz to tętniąca życiem społeczność mieszkaniowa, której celem jest zapewnienie komfortowego i dobrze utrzymanego środowiska życia dla wszystkich mieszkańców. Ten portal służy jako centralne miejsce do bycia na bieżąco i pozostawania w kontakcie z aktywnościami i zasobami społeczności.';

// One representative photograph per gallery category, arranged editorially:
// one large featured photograph (buildings), two smaller stacked photographs
// (green areas, shared spaces) and one wide photograph (community events).
const FEATURED_PHOTOS = [
  {
    area: 'featured',
    category: 'Architektura',
    label: 'Budynki mieszkalne',
    href: '/gallery?category=buildings',
    url: '/gallery/budynki-ulica.jpg',
    alt: 'Zabytkowe kamienice przy ul. Matejki i Wyspiańskiego w Poznaniu',
    count: '1 zdjęcie',
    eager: true,
  },
  {
    area: 'green',
    category: 'Zieleń',
    label: 'Tereny zielone',
    href: '/gallery?category=green',
    url: 'https://images.unsplash.com/photo-QroG4Sr-A7M?q=80&w=1200&auto=format&fit=crop',
    alt: 'Zielone tereny wspólne z drzewami, kwiatami i ławkami',
    count: null,
  },
  {
    area: 'shared',
    category: 'Sąsiedztwo',
    label: 'Przestrzenie wspólne',
    href: '/gallery?category=shared',
    url: 'https://images.unsplash.com/photo-IAgHKpOWIfs?q=80&w=1200&auto=format&fit=crop',
    alt: 'Wspólne przestrzenie osiedla: alejki, wejścia i podwórza',
    count: null,
  },
  {
    area: 'events',
    category: 'Życie osiedla',
    label: 'Wydarzenia społeczności',
    href: '/gallery?category=events',
    url: 'https://www.klubkrag.pl/slider/6b0458ddc5ff9.jpg',
    alt: 'Wydarzenie społeczności w Klubie Osiedlowym Krąg',
    count: '4 zdjęcia',
  },
];

const handleImageError = (event) => {
  // Keep the tile visible (coloured background + label) even if a photo fails
  event.currentTarget.style.display = 'none';
};

export default function CommunitySection() {
  return (
    <section className="community-section" aria-labelledby="community-heading">
      <div className="community-inner">
        {/* Introduction – centered text */}
        <div className="community-intro">
          <span className="community-eyebrow">POZNAJ NASZĄ SPOŁECZNOŚĆ</span>
          <h2 id="community-heading" className="community-title">
            O Naszej Społeczności
          </h2>
          <p className="community-text">{INTRO_TEXT}</p>
          <hr className="community-divider" aria-hidden="true" />
        </div>

        {/* Photo gallery */}
        <div className="community-gallery">
          <h2 className="community-gallery-heading">
            Nasze osiedle w zdjęciach
          </h2>
          <p className="community-gallery-subtitle">
            Zobacz miejsca i przestrzenie, które tworzą naszą społeczność.
          </p>

          <div className="community-grid">
            {FEATURED_PHOTOS.map((photo) => (
              <Link
                key={photo.area}
                to={photo.href}
                className={`community-photo community-photo--${photo.area}`}
                aria-label={`${photo.label} – zobacz zdjęcia w galerii`}
              >
                <div className="community-photo-wrap">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    loading={photo.eager ? 'eager' : 'lazy'}
                    onError={handleImageError}
                  />
                  <div className="community-overlay" aria-hidden="true" />
                  <div className="community-caption">
                    <span className="community-category">{photo.category}</span>
                    <span className="community-label">
                      {photo.label}
                      <span className="community-arrow">→</span>
                    </span>
                    {photo.count && (
                      <span className="community-count">{photo.count}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="community-cta">
            <Link to="/gallery" className="community-button">
              Zobacz pełną galerię zdjęć
              <span className="community-button-arrow">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
