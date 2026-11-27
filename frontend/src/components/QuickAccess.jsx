import { Link } from 'react-router-dom';
import './QuickAccess.css';

// Lucide-style outline icons (inline SVG, same approach as the other home components).
const iconProps = {
  width: 40,
  height: 40,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

// Lucide "megaphone"
function MegaphoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="m3 11 18-5v12L3 14v-3z" />
      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
    </svg>
  );
}

// Lucide "file-text"
function FileTextIcon() {
  return (
    <svg {...iconProps}>
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

// Lucide "phone"
function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

const QUICK_ACCESS_ITEMS = [
  {
    id: 'announcements',
    to: '/announcements',
    title: 'Ogłoszenia',
    description:
      'Bądź na bieżąco z najnowszymi wiadomościami i ważnymi informacjami od administracji osiedla.',
    linkLabel: 'Zobacz Ogłoszenia',
    icon: <MegaphoneIcon />,
  },
  {
    id: 'documents',
    to: '/documents',
    title: 'Dokumenty',
    description:
      'Uzyskaj dostęp do oficjalnych dokumentów, regulaminów, formularzy i protokołów ze spotkań w jednym miejscu.',
    linkLabel: 'Przeglądaj Dokumenty',
    icon: <FileTextIcon />,
  },
  {
    id: 'contact',
    to: '/contact',
    title: 'Kontakt',
    description:
      'Skontaktuj się z zespołem administracji w sprawie zapytań, sugestii lub wsparcia.',
    linkLabel: 'Skontaktuj się',
    icon: <PhoneIcon />,
  },
];

// Reusable card: the whole card is a single link (one tab stop, large click target).
function QuickAccessCard({ to, title, description, linkLabel, icon }) {
  return (
    <li className="qa-item">
      <Link to={to} className="qa-card">
        <div className="qa-card-body">
          <div className="qa-card-head">
            <span className="qa-card-icon" aria-hidden="true">
              {icon}
            </span>
            <h3 className="qa-card-title">{title}</h3>
          </div>

          <p className="qa-card-description">{description}</p>

          <span className="qa-card-link">
            <span className="qa-card-link-text">{linkLabel}</span>
            <span className="qa-card-arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}

function QuickAccess() {
  return (
    <section className="qa-section" aria-labelledby="quick-access-title">
      <div className="qa-inner">
        <header className="qa-header">
          <p className="qa-eyebrow">Szybki Dostęp</p>
          <h2 id="quick-access-title" className="qa-heading">Szybki Dostęp</h2>
          <p className="qa-subtitle">Najważniejsze sprawy osiedla w jednym miejscu. Wybierz, czego potrzebujesz.</p>
        </header>

        <ul className="qa-grid">
          {QUICK_ACCESS_ITEMS.map(({ id, ...item }) => (
            <QuickAccessCard key={id} {...item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default QuickAccess;
