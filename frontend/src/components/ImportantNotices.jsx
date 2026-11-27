import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatDateShort, parseDate } from '../utils/formatDate';
import './ImportantNotices.css';

const PRIORITY_LABELS = {
  important: 'Ważne',
  planned: 'Zaplanowane',
  general: 'Informacja',
};

// The database has no priority column, so the priority is derived from the category / title.
// Red is reserved for genuinely urgent situations (utilities interruptions, failures).
const getPriority = (notice) => {
  const value = `${notice.category || ''} ${notice.title || ''}`.toLowerCase();
  const has = (...words) => words.some((word) => value.includes(word));

  if (has('godzin', 'biur', 'administracyjn')) return 'general';
  if (has('wod', 'prąd', 'prad', 'elektr', 'energi', 'gaz', 'awari', 'pilne', 'ogrzewani')) return 'important';
  if (has('parking', 'konserwac', 'remont', 'prac', 'ruch')) return 'planned';
  return 'general';
};

const getIconType = (notice) => {
  const value = `${notice.category || ''} ${notice.title || ''}`.toLowerCase();
  const has = (...words) => words.some((word) => value.includes(word));

  if (has('godzin', 'biur')) return 'clock';
  if (has('wod')) return 'water';
  if (has('prąd', 'prad', 'elektr', 'energi')) return 'power';
  if (has('parking')) return 'parking';
  if (has('konserwac', 'remont', 'prac')) return 'tools';
  return 'info';
};

const getValidityText = (notice) => {
  const from = formatDateShort(notice.valid_from);
  if (!notice.valid_until) {
    return `od ${from} do odwołania`;
  }
  const until = formatDateShort(notice.valid_until);
  return from === until ? from : `${from} – ${until}`;
};

const svgProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

function BellIcon() {
  return (
    <svg {...svgProps} width="26" height="26" className="notices-heading-icon">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg {...svgProps} width="14" height="14" className="notice-small-icon">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon({ size = 14, className = 'notice-small-icon' }) {
  return (
    <svg {...svgProps} width={size} height={size} className={className}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function NoticeTypeIcon({ type }) {
  switch (type) {
    case 'water':
      return (
        <svg {...svgProps} width="22" height="22">
          <path d="M12 2.7s7 7.2 7 12.1a7 7 0 0 1-14 0C5 9.9 12 2.7 12 2.7z" />
        </svg>
      );
    case 'power':
      return (
        <svg {...svgProps} width="22" height="22">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'parking':
      return (
        <svg {...svgProps} width="22" height="22">
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
        </svg>
      );
    case 'tools':
      return (
        <svg {...svgProps} width="22" height="22">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'clock':
      return <ClockIcon size={22} className="" />;
    default:
      return (
        <svg {...svgProps} width="22" height="22">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
  }
}

function ImportantNotices() {
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/important-notices');
        const result = await response.json();
        if (!cancelled && result.success) {
          setNotices(result.data);
        }
      } catch (error) {
        console.error('Error fetching important notices:', error);
      }
    };

    fetchNotices();
    return () => {
      cancelled = true;
    };
  }, []);

  // The area is only displayed when there is something important to communicate
  if (notices.length === 0) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <section className="notices-section" aria-labelledby="notices-title">
      <div className="notices-inner">
        <header className="notices-header">
          <div className="notices-header-text">
            <h2 id="notices-title" className="notices-title">
              <BellIcon />
              <span>Ważne komunikaty</span>
            </h2>
            <p className="notices-subtitle">
              Najważniejsze informacje i komunikaty dotyczące funkcjonowania naszego osiedla
            </p>
          </div>
          <Link to="/announcements" className="notices-all-link">
            Zobacz wszystkie komunikaty →
          </Link>
        </header>

        <div className="notices-list">
          {notices.map((notice) => {
            const inferredPriority = getPriority(notice);
            const validFrom = parseDate(notice.valid_from);
            const isUpcoming = validFrom && validFrom > today;
            const priority = inferredPriority === 'important' ? 'important' : isUpcoming ? 'planned' : inferredPriority;

            return (
              <article key={notice.id} className={`notice-card notice-${priority}`}>
                <div className="notice-icon">
                  <NoticeTypeIcon type={getIconType(notice)} />
                </div>

                <div className="notice-body">
                  <div className="notice-meta">
                    <span className="notice-badge">{PRIORITY_LABELS[priority]}</span>
                    {isUpcoming && priority !== 'planned' && <span className="notice-status">Zaplanowane</span>}
                    {notice.category && <span className="notice-category">{notice.category}</span>}
                  </div>
                  <h3 className="notice-title">{notice.title}</h3>
                  <p className="notice-description">{notice.description}</p>
                </div>
                <footer className="notice-footer">
                  <p className="notice-published">
                    <CalendarIcon />
                    <span>Opublikowano: {formatDate(notice.published_date)}</span>
                  </p>

                  <div className="notice-validity">
                    <span className="notice-validity-label">
                      <ClockIcon />
                      Obowiązuje:
                    </span>
                    <span className="notice-validity-value">{getValidityText(notice)}</span>
                  </div>
                </footer>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ImportantNotices;

