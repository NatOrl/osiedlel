import { useEffect, useRef, useState } from 'react';

function AnnouncementContent({ id, content, expanded, onToggle }) {
  const contentRef = useRef(null);
  const [hasHiddenText, setHasHiddenText] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    const observer = new ResizeObserver(() => {
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      // scrollHeight includes clipped content and also works while expanded.
      setHasHiddenText(element.scrollHeight > lineHeight * 4 + 1);
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [content]);

  return (
    <>
      <p
        ref={contentRef}
        id={`post-content-${id}`}
        className={`announcement-content${expanded ? '' : ' announcement-content--collapsed'}`}
      >
        {content}
      </p>
      {hasHiddenText && (
        <div className="announcement-actions">
          <button
            type="button"
            className="read-more"
            aria-expanded={expanded}
            aria-controls={`post-content-${id}`}
            onClick={onToggle}
          >
            {expanded ? 'Zwiń tekst' : 'Czytaj więcej'}
            <span aria-hidden="true">{expanded ? '↑' : '→'}</span>
          </button>
        </div>
      )}
    </>
  );
}

export default AnnouncementContent;