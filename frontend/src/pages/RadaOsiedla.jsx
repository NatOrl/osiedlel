import { Link } from 'react-router-dom';
import './RadaOsiedla.css';

const members = [
  { id: 'chair', role: 'Przewodniczący' },
  { id: 'vice-chair', role: 'Wiceprzewodniczący' },
  { id: 'secretary', role: 'Sekretarz' },
  { id: 'member-1', role: 'Członek Rady' },
  { id: 'member-2', role: 'Członek Rady' },
  { id: 'member-3', role: 'Członek Rady' },
].map((member) => ({
  ...member,
  name: 'Imię i Nazwisko',
  email: 'email@example.com',
  phone: '123 456 789',
}));

const responsibilities = [
  {
    icon: 'people',
    title: 'Reprezentacja mieszkańców',
    description: 'Reprezentowanie interesów mieszkańców wobec administracji i władz miasta.',
  },
  {
    icon: 'cooperation',
    title: 'Współpraca',
    description: 'Współpraca z administracją w sprawach dotyczących zarządzania osiedlem.',
  },
  {
    icon: 'bulb',
    title: 'Inicjatywy',
    description: 'Inicjowanie działań na rzecz poprawy warunków życia na osiedlu.',
  },
  {
    icon: 'message',
    title: 'Komunikacja',
    description: 'Organizacja spotkań z mieszkańcami i informowanie o ważnych sprawach.',
  },
  {
    icon: 'building',
    title: 'Rozwój osiedla',
    description: 'Opiniowanie planów rozwoju i modernizacji infrastruktury osiedla.',
  },
  {
    icon: 'document',
    title: 'Wnioski i petycje',
    description: 'Przyjmowanie i przekazywanie wniosków oraz petycji mieszkańców.',
  },
];

const iconPaths = {
  person: <><circle cx="12" cy="8" r="4" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
  people: <><circle cx="9" cy="8" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 15a5 5 0 0 1 3 5" /></>,
  cooperation: <><path d="m3 8 4-3 4 2 4-2 6 4-3 7-5 4-6-3-4-9Z" /><path d="m11 7-3 4 3 2 3-3 5 5M7 17l3-3M10 19l3-3M2 7l3-2M20 7l2 1" /></>,
  bulb: <><path d="M8 15a7 7 0 1 1 8 0l-1 3H9l-1-3ZM9 21h6M12 3V1M3 5 1 3M21 5l2-2" /><path d="M12 18v-6l-2-2m2 2 2-2" /></>,
  message: <><path d="M21 11a8 8 0 0 1-8 8H7l-5 3 2-6a8 8 0 0 1-2-5V5a2 2 0 0 1 2-2h15a2 2 0 0 1 2 2v6Z" /><path d="M7 8h9M7 12h6" /></>,
  building: <><path d="M3 21h18M5 21V5l7-3 7 3v16M10 21v-5h4v5M8 7h1m6 0h1M8 11h1m6 0h1" /></>,
  document: <><path d="M14 2H5v20h14V7l-5-5ZM14 2v5h5M8 12h8M8 16h6" /></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M7 3v4M17 3v4M3 11h18M8 15h2M14 15h2M8 18h2" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="3" /></>,
  mail: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 6 10 7L22 6" /></>,
  phone: <path d="m7 3 3 5-3 3a15 15 0 0 0 6 6l3-3 5 3v3a2 2 0 0 1-2 2C9 21 3 15 2 5a2 2 0 0 1 2-2h3Z" />,
  arrow: <path d="M4 12h16m-6-6 6 6-6 6" />,
};

function CouncilIcon({ name }) {
  return (
    <svg
      className="council-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {iconPaths[name]}
    </svg>
  );
}

export default function RadaOsiedla() {
  return (
    <div className="rada-osiedla-page">
      <header className="council-header">
        <div className="council-header-inner">
          <nav className="council-breadcrumb" aria-label="Ścieżka nawigacji">
            <Link to="/" className="council-breadcrumb-link">Strona główna</Link>
            <span className="council-breadcrumb-separator" aria-hidden="true">›</span>
            <span className="council-breadcrumb-current" aria-current="page">Rada Osiedla</span>
          </nav>
          <div className="council-header-content">
            <div className="council-header-text">
              <h1>Rada Osiedla</h1>
              <div className="council-header-accent" aria-hidden="true" />
              <p className="council-header-description">
                Poznaj Radę Osiedla Łazarz — reprezentację mieszkańców.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="council-section council-intro" aria-labelledby="council-about-heading">
        <h2 id="council-about-heading">O Radzie Osiedla</h2>
        <p>
          Rada Osiedla jest organem reprezentującym interesy mieszkańców Osiedla Łazarz.
          Działa na rzecz poprawy warunków życia, organizuje spotkania z mieszkańcami
          oraz współpracuje z administracją w sprawach dotyczących osiedla.
        </p>
      </section>

      <section className="council-section council-members" aria-labelledby="council-members-heading">
        <div className="council-members-header">
          <div>
            <p className="council-members-eyebrow">Kadencja 2024–2029</p>
            <h2 id="council-members-heading">Skład Rady Osiedla</h2>
          </div>
          <p className="council-members-description">
            Osoby wybrane, by reprezentować głos naszej lokalnej społeczności.
          </p>
        </div>
        <div className="council-members-grid">
          {members.map((member) => (
            <article className="council-member-card" key={member.id}>
              <span className="council-avatar"><CouncilIcon name="person" /></span>
              <p className="council-member-role">{member.role}</p>
              <h3>{member.name}</h3>
              <a className="council-member-contact" href={`mailto:${member.email}`}>
                {member.email}
              </a>
              <a className="council-member-contact" href={`tel:${member.phone.replace(/\s/g, '')}`}>
                <CouncilIcon name="phone" />
                {member.phone}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="council-section council-responsibilities" aria-labelledby="council-tasks-heading">
        <p className="council-responsibilities-eyebrow">Działamy dla Łazarza:</p>
        <h2 id="council-tasks-heading">Zadania Rady Osiedla</h2>
        <div className="council-tasks-grid">
          {responsibilities.map((task) => (
            <article className="council-task-card" key={task.title}>
              <span className="council-task-icon"><CouncilIcon name={task.icon} /></span>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="council-section council-meetings" aria-labelledby="council-meetings-heading">
        <div className="council-meetings-heading">
          <span className="council-contact-icon"><CouncilIcon name="calendar" /></span>
          <h2 id="council-meetings-heading">Spotkania Rady</h2>
        </div>
        <p className="council-meetings-description">
          Rada Osiedla spotyka się regularnie, aby rozmawiać o sprawach ważnych dla naszej
          społeczności. Zapraszamy mieszkańców do udziału w spotkaniach.
        </p>
        <dl className="council-meeting-details">
          <div>
            <dt><CouncilIcon name="calendar" />Termin</dt>
            <dd>Pierwszy czwartek miesiąca</dd>
          </div>
          <div>
            <dt><CouncilIcon name="clock" />Godzina</dt>
            <dd><time dateTime="18:00">18:00</time></dd>
          </div>
          <div>
            <dt><CouncilIcon name="pin" />Miejsce</dt>
            <dd>Siedziba administracji osiedla</dd>
          </div>
        </dl>
        <p className="council-meetings-note">
          Mieszkańcy są mile widziani i mogą zgłaszać swoje sprawy oraz propozycje.
        </p>
      </section>

      <section
        id="kontakt-rady"
        className="council-section council-contact"
        aria-labelledby="council-contact-heading"
        tabIndex={-1}
      >
        <div className="council-contact-header">
          <div>
            <p className="council-contact-eyebrow">Jesteśmy do dyspozycji</p>
            <h2 id="council-contact-heading">Kontakt z Radą Osiedla</h2>
          </div>
          <p className="council-contact-description">
            Napisz, zadzwoń lub odwiedź nas. Chętnie odpowiemy na pytania i wysłuchamy Twoich propozycji.
          </p>
        </div>
        <dl className="council-contact-details">
          <div className="council-contact-item">
            <span className="council-contact-icon"><CouncilIcon name="mail" /></span>
            <div>
              <dt>Email</dt>
              <dd><a href="mailto:rada@osiedlelazarz.pl">rada@osiedlelazarz.pl</a></dd>
            </div>
          </div>
          <div className="council-contact-item">
            <span className="council-contact-icon"><CouncilIcon name="phone" /></span>
            <div>
              <dt>Telefon</dt>
              <dd><a href="tel:612345678">61 234 56 78</a></dd>
            </div>
          </div>
          <div className="council-contact-item">
            <span className="council-contact-icon"><CouncilIcon name="pin" /></span>
            <div>
              <dt>Adres</dt>
              <dd><address>ul. Łazarz 1, 61-000 Poznań</address></dd>
            </div>
          </div>
        </dl>
      </section>

      <section className="council-cta" aria-labelledby="council-cta-heading">
        <span className="council-cta-icon" aria-hidden="true">
          <CouncilIcon name="people" />
        </span>
        <h2 id="council-cta-heading">Zaangażuj się!</h2>
        <p>
          Twój głos ma znaczenie! Weź udział w spotkaniach Rady Osiedla i pomóż
          kształtować przyszłość naszej społeczności.
        </p>
        <a className="council-cta-button" href="#kontakt-rady">
          Skontaktuj się z Radą <CouncilIcon name="arrow" />
        </a>
      </section>
    </div>
  );
}
