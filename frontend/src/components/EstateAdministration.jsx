import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './EstateAdministration.css';

const iconProps = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': 'true',
  focusable: 'false',
  className: 'team-contact-icon',
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="22 6 12 13 2 6" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function EstateAdministration() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [council, setCouncil] = useState([]);
  const [councilStatus, setCouncilStatus] = useState('idle');

  const loadCouncil = async (event) => {
    if (!event.currentTarget.open || councilStatus !== 'idle') return;
    setCouncilStatus('loading');
    try {
      const response = await fetch('/api/admin/content/council');
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error('Council request failed');
      setCouncil(result.data);
      setCouncilStatus('loaded');
    } catch {
      setCouncilStatus('error');
    }
  };

  useEffect(() => {
    let cancelled = false;

    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees?featured=true');
        const result = await response.json();
        if (cancelled) return;
        if (response.ok && result.success) {
          setEmployees(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching employees:', err);
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchEmployees();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="team-section" aria-labelledby="admin-intro-title">
      <div className="team-inner">
        <header className="team-header">
          <div className="team-header-text">
            <p className="team-eyebrow">Ludzie, którzy są blisko</p>
            <h2 id="admin-intro-title" className="team-title">Poznaj nasz zespół</h2>
            <p className="team-subtitle">
              Pomagamy w codziennych sprawach i dbamy o dobre sąsiedztwo.
            </p>
          </div>
          <Link to="/employees" className="team-all-link">Zobacz cały zespół →</Link>
        </header>

        {loading && <p className="team-status">Ładowanie informacji o pracownikach...</p>}
        {error && <p className="team-status">Nie udało się załadować informacji o pracownikach.</p>}
        {!loading && !error && employees.length === 0 && (
          <p className="team-status">Informacje o pracownikach wkrótce.</p>
        )}

        {employees.length > 0 && (
          <div className="team-grid">
            {employees.map((employee) => (
              <article key={employee.id} className="team-card">
                <div className="team-photo">
                  {employee.photo_url ? (
                    <img
                      src={employee.photo_url}
                      alt={`${employee.full_name} – ${employee.position}`}
                      loading="lazy"
                    />
                  ) : (
                    <div className="team-photo-placeholder" aria-hidden="true">
                      <UserIcon />
                    </div>
                  )}
                </div>

                <div className="team-body">
                  <h3 className="team-name">{employee.full_name}</h3>
                  <p className="team-position">{employee.position}</p>
                  {employee.responsibilities && (
                    <p className="team-responsibilities" title={employee.responsibilities}>
                      {employee.responsibilities}
                    </p>
                  )}

                  {(employee.phone || employee.email) && (
                    <div className="team-contact">
                      {employee.phone && (
                        <a
                          href={`tel:${employee.phone.replace(/\s/g, '')}`}
                          className="team-contact-link"
                        >
                          <PhoneIcon />
                          <span>{employee.phone}</span>
                        </a>
                      )}
                      {employee.email && (
                        <a href={`mailto:${employee.email}`} className="team-contact-link">
                          <MailIcon />
                          <span>{employee.email}</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <details className="team-council" onToggle={loadCouncil}>
          <summary>Rada Osiedla — poznaj naszych przedstawicieli</summary>
          <div className="team-council-body">
            {councilStatus === 'loading' && <p className="team-status" role="status">Ładowanie informacji o Radzie Osiedla...</p>}
            {councilStatus === 'error' && <p className="team-status" role="status">Nie udało się załadować informacji o Radzie Osiedla.</p>}
            {councilStatus === 'loaded' && council.length === 0 && <p className="team-status">Informacje o członkach Rady Osiedla wkrótce.</p>}
            {council.map((member) => (
              <article className="team-council-entry" key={member.id}>
                <h3 className="team-name">{member.title}</h3>
                <p className="team-position">{member.role}</p>
                {member.phone && <a className="team-contact-link" href={`tel:${member.phone.replace(/\s/g, '')}`}><PhoneIcon /><span>{member.phone}</span></a>}
                {member.email && <a className="team-contact-link" href={`mailto:${member.email}`}><MailIcon /><span>{member.email}</span></a>}
              </article>
            ))}
            <Link to="/rada-osiedla" className="team-all-link">Więcej o Radzie Osiedla →</Link>
          </div>
        </details>
      </div>
    </section>
  );
}

export default EstateAdministration;
