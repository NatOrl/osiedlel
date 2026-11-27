import { Link } from 'react-router-dom';
import { GALLERY_CATEGORIES, GALLERY_PHOTOS } from '../data/galleryPhotos';
import './EstatePhotos.css';

function EstatePhotos() {
  // If a photo cannot be loaded, hide it - the tile falls back to its green placeholder
  const handleImageError = (event) => {
    event.currentTarget.style.display = 'none';
  };

  return (
    <div className="estate-photos" aria-labelledby="estate-photos-title" role="group">
      <h2 id="estate-photos-title" className="estate-photos-title">Nasze osiedle w zdjęciach</h2>

      <div className="estate-photos-grid">
        {GALLERY_CATEGORIES.map((category) => {
          const photos = GALLERY_PHOTOS.filter((photo) => photo.category === category.id);
          const cover = photos[0];

          return (
            <Link
              key={category.id}
              to={`/gallery?category=${category.id}`}
              className="estate-photo-tile"
              aria-label={`${category.label} – zobacz zdjęcia w galerii`}
            >
              <div className="estate-photo-placeholder" aria-hidden="true">
                <span className="estate-photo-icon">{category.icon}</span>
                {!cover && <span className="estate-photo-soon">Zdjęcia wkrótce</span>}
              </div>
              {cover && (
                <img
                  src={cover.url}
                  alt={cover.alt}
                  loading="lazy"
                  onError={handleImageError}
                />
              )}
              <div className="estate-photo-caption">
                <span className="estate-photo-label">{category.label}</span>
                {photos.length > 0 && (
                  <span className="estate-photo-count">
                    {photos.length} {photos.length === 1 ? 'zdjęcie' : 'zdjęć'}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="estate-photos-cta">
        <Link to="/gallery" className="estate-photos-button">
          Zobacz pełną galerię zdjęć →
        </Link>
      </div>
    </div>
  );
}

export default EstatePhotos;
