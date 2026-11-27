import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ImageLightbox from '../components/ImageLightbox';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS } from '../data/galleryPhotos';
import './Gallery.css';

function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const requested = searchParams.get('category');
  const activeCategory = GALLERY_CATEGORIES.some((c) => c.id === requested) ? requested : 'all';

  const visiblePhotos = GALLERY_PHOTOS.filter(
    (photo) => activeCategory === 'all' || photo.category === activeCategory
  );

  const selectCategory = (id) => {
    setLightboxIndex(null);
    if (id === 'all') {
      setSearchParams({});
    } else {
      setSearchParams({ category: id });
    }
  };

  const navigateLightbox = (direction) => {
    setLightboxIndex((current) => {
      if (current === null) return current;
      const total = visiblePhotos.length;
      return (current + direction + total) % total;
    });
  };

  const getCategory = (id) => GALLERY_CATEGORIES.find((c) => c.id === id);

  return (
    <div className="gallery-page">
      <div className="page-header">
        <h1 className="page-title">Galeria zdjęć</h1>
        <p className="page-description">
          Nasze osiedle w obiektywie – budynki, tereny zielone, wspólne przestrzenie i wydarzenia
        </p>
      </div>

      <div className="gallery-filters" role="group" aria-label="Kategorie zdjęć">
        <button
          type="button"
          className={`gallery-filter ${activeCategory === 'all' ? 'active' : ''}`}
          aria-pressed={activeCategory === 'all'}
          onClick={() => selectCategory('all')}
        >
          Wszystkie
        </button>
        {GALLERY_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`gallery-filter ${activeCategory === category.id ? 'active' : ''}`}
            aria-pressed={activeCategory === category.id}
            onClick={() => selectCategory(category.id)}
          >
            {category.icon} {category.label}
          </button>
        ))}
      </div>

      {visiblePhotos.length > 0 ? (
        <div className="gallery-grid">
          {visiblePhotos.map((photo, index) => (
            <figure key={photo.id} className="gallery-item">
              <button
                type="button"
                className="gallery-item-button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`Powiększ zdjęcie: ${photo.alt}`}
              >
                <img src={photo.url} alt={photo.alt} loading="lazy" />
              </button>
              <figcaption>{getCategory(photo.category)?.label}</figcaption>
            </figure>
          ))}
        </div>
      ) : (
        <div className="gallery-empty">
          <span className="gallery-empty-icon">📷</span>
          <h3>Zdjęcia wkrótce</h3>
          <p>W tej kategorii nie ma jeszcze żadnych zdjęć. Sprawdź ponownie później.</p>
        </div>
      )}

      {lightboxIndex !== null && visiblePhotos[lightboxIndex] && (
        <ImageLightbox
          images={visiblePhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={navigateLightbox}
        />
      )}
    </div>
  );
}

export default Gallery;
