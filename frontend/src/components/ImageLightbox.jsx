import { useEffect, useCallback, useRef } from 'react';
import './ImageLightbox.css';

function ImageLightbox({ images, currentIndex, onClose, onNavigate }) {
  const overlayRef = useRef(null);
  const closeButtonRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onNavigate(-1);
    } else if (e.key === 'ArrowRight') {
      onNavigate(1);
    } else if (e.key === 'Tab') {
      const buttons = overlayRef.current?.querySelectorAll('button');
      if (!buttons?.length) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }, [onClose, onNavigate]);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    closeButtonRef.current?.focus();
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!images || images.length === 0 || currentIndex === null || currentIndex === undefined) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <div ref={overlayRef} className="lightbox-overlay" role="dialog" aria-modal="true" aria-label="Podgląd zdjęć" onClick={onClose}>
      <button
        ref={closeButtonRef}
        type="button"
        className="lightbox-close"
        onClick={onClose}
        aria-label="Zamknij podgląd zdjęcia"
      >
        ×
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={currentImage.url}
          alt={currentImage.alt || 'Zdjęcie ogłoszenia'}
          className="lightbox-image"
        />

        {images.length > 1 && (
          <>
            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(-1);
              }}
              aria-label="Poprzednie zdjęcie"
            >
              ‹
            </button>
            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(1);
              }}
              aria-label="Następne zdjęcie"
            >
              ›
            </button>

            <div className="lightbox-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageLightbox;
