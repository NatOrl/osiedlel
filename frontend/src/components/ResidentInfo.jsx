import './ResidentInfo.css';

// Lucide-style outline icons (same approach as the other home components).
const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
};

// Lucide "calendar"
function CalendarIcon() {
  return (
    <svg {...iconProps}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

// Lucide "clock"
function ClockIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
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

const DUTY_STAFF = [
  { role: 'Instalator', phone: '501 327 211', tel: '501327211' },
  { role: 'Elektryk', phone: '501 037 856', tel: '501037856' },
  { role: 'Kierownik', phone: '503 074 873', tel: '503074873' },
];

const OPENING_HOURS = [
  { day: 'Poniedziałek – piątek', hours: '8:00–16:00' },
  { day: 'Sobota', hours: '9:00–13:00', saturday: true },
  { day: 'Niedziela', status: 'Nieczynne' },
];

const IMPORTANT_NUMBERS = [
  { service: 'Administracja', phone: '61 234 56 78', tel: '612345678' },
  { service: 'Pogotowie techniczne', phone: '500 123 456', tel: '500123456' },
  { service: 'Ochrona osiedla', phone: '500 654 321', tel: '500654321' },
];

// Reusable card: icon element + heading, optional date badge and a list of rows.
function InfoCard({ icon, heading, badge, note, children }) {
  return (
    <article className="ri-card">
      <div className="ri-card-head">
        <div className="ri-icon">{icon}</div>
        <h3 className="ri-heading">{heading}</h3>
      </div>
      <div className="ri-card-meta">
        {badge && <span className="ri-badge">{badge}</span>}
      </div>
      <div className="ri-body">{children}</div>
      {note && <p className="ri-note">{note}</p>}
    </article>
  );
}

export default function ResidentInfo() {
  return (
    <section className="ri-section" aria-labelledby="ri-title">
      <div className="ri-inner">
        <header className="ri-header">
          <p className="ri-eyebrow">Praktycznie i po sąsiedzku</p>
          <h2 id="ri-title" className="ri-section-title">
            Informacje dla mieszkańców
          </h2>
          <p className="ri-subtitle">Godziny pracy, dyżury i numery, które warto mieć pod ręką.</p>
        </header>
        <ul className="ri-grid">
          <li className="ri-item">
            <InfoCard
              icon={<CalendarIcon />}
              heading="Dyżury domowe pracowników osiedla"
              badge="28–29.03.2026"
              note="Wybierz numer telefonu, aby zadzwonić."
            >
              {DUTY_STAFF.map((item) => (
                <div key={item.role} className="ri-row">
                  <span className="ri-role">{item.role}</span>
                  <a href={`tel:${item.tel}`} className="ri-tel">
                    {item.phone}
                  </a>
                </div>
              ))}
            </InfoCard>
          </li>
          <li className="ri-item">
            <InfoCard icon={<ClockIcon />} heading="Godziny otwarcia biura">
              {OPENING_HOURS.map((item) => {
                if (item.saturday) {
                  return (
                    <div key={item.day} className="ri-row ri-row--saturday">
                      <span className="ri-day">{item.day}</span>
                      <span className="ri-hours">{item.hours}</span>
                    </div>
                  );
                }
                if (item.status) {
                  return (
                    <div key={item.day} className="ri-row">
                      <span className="ri-day">{item.day}</span>
                      <span className="ri-status">{item.status}</span>
                    </div>
                  );
                }
                return (
                  <div key={item.day} className="ri-row">
                    <span className="ri-day">{item.day}</span>
                    <span className="ri-hours">{item.hours}</span>
                  </div>
                );
              })}
            </InfoCard>
          </li>
          <li className="ri-item">
            <InfoCard icon={<PhoneIcon />} heading="Ważne numery" note="Wybierz numer telefonu, aby zadzwonić.">
              {IMPORTANT_NUMBERS.map((item) => (
                <div key={item.service} className="ri-row">
                  <span className="ri-service">{item.service}</span>
                  <a
                    href={`tel:${item.tel}`}
                    className="ri-tel ri-contact-tel"
                  >
                    {item.phone}
                  </a>
                </div>
              ))}
            </InfoCard>
          </li>
        </ul>
      </div>
    </section>
  );
}
