import { parseDate } from '../utils/formatDate';
import './CommunityClub.css';

const CLUB_URL = 'https://www.klubkrag.pl/';
const CLUB_NAME = 'Klub Krąg';

// Photos published on the club website (slider on https://www.klubkrag.pl/).
// General club photographs, not specific to a given event.
const CLUB_PHOTOS = [
  'https://www.klubkrag.pl/slider/6b0458ddc5ff9.jpg',
  'https://www.klubkrag.pl/slider/68c182942ad63.jpg',
  'https://www.klubkrag.pl/slider/6707143292efc.jpg',
  'https://www.klubkrag.pl/slider/6b045b5db680b.jpg',
];

// Upcoming events / workshops copied from the club calendar (https://www.klubkrag.pl/?menu=2).
// Events whose date has already passed are hidden automatically.
// Update this list (or replace with an API call) when the club publishes new events.
const CLUB_EVENTS = [
  {
    date: '2026-11-26',
    time: '12:00',
    category: 'Spotkanie autorskie',
    title: 'Spotkanie z Waldemarem Cichoniem',
    description: 'Spotkanie autorskie w Klubie Osiedlowym Krąg.',
    location: CLUB_NAME,
    image: CLUB_PHOTOS[0],
  },
  {
    date: '2026-11-26',
    time: '17:00',
    category: 'Zabawa taneczna',
    title: 'Zabawa andrzejkowa',
    description: 'Zabawa Klubu Seniora Bamberka z zespołem Remis. Obowiązują zapisy.',
    location: CLUB_NAME,
    image: CLUB_PHOTOS[1],
  },
  {
    date: '2026-12-01',
    time: '18:00',
    category: 'Spotkanie klubowe',
    title: 'Klub Górski Grań',
    description: 'Stanisław Dankowski – Plastuś częścią Grani.',
    location: CLUB_NAME,
    image: CLUB_PHOTOS[2],
  },
  {
    date: '2026-12-10',
    time: '17:00',
    category: 'Koncert',
    title: 'Koncert przedświąteczny',
    description: 'Koncert w ramach projektu Aktywny Senior 2026.',
    location: CLUB_NAME,
    image: CLUB_PHOTOS[3],
  },
];

// Regular weekly activities from the club's weekly plan (https://www.klubkrag.pl/?menu=3)
const CLUB_ACTIVITIES = [
  {
    name: 'Zdrowy kręgosłup 60+ i Zumba gold 60+',
    weekday: 'Poniedziałek',
    status: 'Zajęcia bezpłatne',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-6 3 6 2 6-2M12 13v4m0 0-4 4m4-4 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Rysunek dla dorosłych i dzieci',
    weekday: 'Poniedziałek i środa',
    status: 'Zajęcia płatne',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m15 4 5 5M4 20l5-1L21 7l-4-4L5 15l-1 5Zm1-5 4 4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Zajęcia językowe – angielski i hiszpański',
    weekday: 'Wtorek',
    status: 'Zapisy online',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16v12H9l-5 4V4Zm4 4h8m-8 4h5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Rękodzieło dla seniorów',
    weekday: 'Środa',
    status: 'Zajęcia bezpłatne',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m8 8 12 12M8 16 20 4M5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm0 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Joga i Zumba fitness',
    weekday: 'Poniedziałek / środa',
    status: 'Grupy otwarte',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm-7 4 7-2 7 2m-7-2v6m0 0-6 4H3m9-4 6 4h3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Akademia Zabawy, balet dla dzieci',
    weekday: 'Wtorek',
    status: 'Zajęcia dla dzieci',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3-5.5 3 1-6.5L3 10l6-1 3-6Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

// Contact information for the right-hand panel
const CONTACT_INFO = [
  {
    label: 'Adres',
    detail: 'ul. Dmowskiego 37, 60-222 Poznań',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="12" cy="9" r="1" stroke="currentColor" strokeWidth={1.6} />
      </svg>
    ),
  },
  {
    label: 'Godziny zajęć',
    detail: (
      <>
        Poniedziałek – piątek<br />
        Około 11:30–20:00 (zgodnie z planem tygodniowym)
      </>
    ),
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={1.6} fill="none" />
        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    label: 'Telefon',
    detail: <a href="tel:616474288">61 64-74-288</a>,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth={1.6} fill="none" />
      </svg>
    ),
  },
  {
    label: 'E-mail',
    detail: <a href="mailto:klubkrag@osiedlelazarz.pl">klubkrag@osiedlelazarz.pl</a>,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" fill="none" />
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
];

const MAX_EVENTS = 3;

function EventIcon({ location = false }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {location ? <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></> : <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>}
    </svg>
  );
}

function CommunityClub() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = CLUB_EVENTS
    .filter((event) => parseDate(event.date) >= today)
    .slice(0, MAX_EVENTS);

  const getBadge = (dateString) => {
    const date = parseDate(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('pl-PL', { month: 'short' }).replace('.', ''),
    };
  };

  return (
    <section className="club-section" aria-labelledby="club-title">
      <div className="club-inner">
      <div className="club-columns">
      <div className="club-introduction-column">
      <header className="club-header">
      <p className="club-eyebrow">Kultura i sąsiedzkie spotkania</p>
      <h2 id="club-title" className="club-heading">Klub Osiedlowy <span>KRĄG</span></h2>
      <p className="club-lead">
        Od 1980 roku miejsce spotkań mieszkańców Łazarza – oferta kulturalna i edukacyjna
        dla wszystkich grup wiekowych, od przedszkolaka po seniora.
      </p>
      </header>

      <div className="club-activities-column">
        <h3 className="club-activities-title">Stałe zajęcia</h3>
        <div className="club-activities-grid">
          {CLUB_ACTIVITIES.map((activity) => (
            <article key={activity.name} className="activity-card">
              <div className="activity-icon">{activity.icon}</div>
              <div className="activity-content">
                <h4 className="activity-title">{activity.name}</h4>
                <p className="activity-weekday">{activity.weekday}</p>
                <span className="activity-status">{activity.status}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="club-contact-panel">
        <h3 className="club-contact-title">Informacje i kontakt</h3>
        <div className="club-contact-groups">
          {CONTACT_INFO.map((group) => (
            <div key={group.label} className="club-contact-group">
              <span className="club-contact-icon">{group.icon}</span>
              <div className="club-contact-content">
                <span className="club-contact-label">{group.label}</span>
                <span className="club-contact-detail">{group.detail}</span>
              </div>
            </div>
          ))}
        </div>
        <a href={CLUB_URL} target="_blank" rel="noopener noreferrer" className="club-cta-button">Odwiedź stronę klubu →</a>
      </div>
      </div>

      <div className="club-events-column">
      <h3 className="club-subtitle">Nadchodzące wydarzenia i warsztaty</h3>
      {upcomingEvents.length > 0 ? (
        <div className="club-events-grid">
          {upcomingEvents.map((event) => {
            const badge = getBadge(event.date);
            return (
              <article key={`${event.date}-${event.time}-${event.title}`} className="event-card">
                <time className="event-badge" dateTime={event.date}>
                  <span className="event-badge-day">{badge.day}</span>
                  <span className="event-badge-month">{badge.month}</span>
                </time>

                <div className="event-card-content">
                  <span className="event-category">{event.category}</span>
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <span className="event-meta-item">
                      <EventIcon />
                      <span className="event-meta-label">Godzina:</span> {event.time}
                    </span>
                    <span className="event-meta-item">
                      <EventIcon location />
                      <span className="event-meta-label">Miejsce:</span> {event.location}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="club-empty">
          Aktualny kalendarz imprez i warsztatów znajdziesz na stronie klubu.
        </p>
      )}

      <img className="club-supporting-image" src={CLUB_PHOTOS[0]} alt="Spotkania i wydarzenia w Klubie Osiedlowym Krąg" loading="lazy" />
      </div>
      </div>
      </div>
    </section>
  );
}

export default CommunityClub;
