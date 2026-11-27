import { useState } from 'react';
import './ImageCarousel.css';

function ImageCarousel({ images, onImageClick, title = 'Ogłoszenie' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return null;
  }

  const visibleIndices = [currentIndex % images.length];

  return (
    <div className="carousel-container" role="group" aria-roledescription="karuzela" aria-label={`Zdjęcia: ${title}`}>
      <div className="carousel-slides">
        {visibleIndices.map((imageIndex, idx) => (
          <button
            type="button"
            key={`${currentIndex}-${idx}`}
            className="carousel-slide"
            onClick={() => onImageClick && onImageClick(imageIndex)}
            aria-label={`Powiększ zdjęcie ${imageIndex + 1}: ${images[imageIndex].alt || title}`}
            aria-haspopup="dialog"
          >
            <img 
              src={images[imageIndex].url} 
              alt={images[imageIndex].alt || title}
              loading="lazy"
              decoding="async"
            />
          </button>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button 
            type="button"
            className="carousel-button carousel-button-prev"
            onClick={goToPrevious}
            aria-label="Poprzednie zdjęcie"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6" /></svg>
          </button>
          <button 
            type="button"
            className="carousel-button carousel-button-next"
            onClick={goToNext}
            aria-label="Następne zdjęcie"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6" /></svg>
          </button>

          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                type="button"
                key={index}
                className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Przejdź do zdjęcia ${index + 1}`}
                aria-pressed={index === currentIndex}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ImageCarousel;
