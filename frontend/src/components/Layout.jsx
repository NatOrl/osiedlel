import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminDashboard, setAdminDashboard] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Strona Główna'},
    { path: '/announcements', label: 'Ogłoszenia'},
    { path: '/documents', label: 'Dokumenty'},
    { path: '/rada-osiedla', label: 'Rada Osiedla'},
    { path: '/contact', label: 'Kontakt'},
    { path: '/administration', label: 'Administracja', icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="5" y="10" width="14" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </svg>
    ) },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`layout ${adminDashboard ? 'layout-admin-dashboard' : ''}`}>
      {!adminDashboard && <header className="header">
        <div className="header-container">
          <div className="logo-section">
            <Link to="/" className="logo-link" onClick={closeMobileMenu}>
              <div className="logo">
                <svg
                  className="logo-icon"
                  width="30"
                  height="30"
                  viewBox="0 0 32 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path d="M3 28h26" />
                  <path d="M6 28V14l8-6.5 8 6.5v14" />
                  <path d="M22 28V12l4 3v13" />
                  <path d="M11 28v-7h6v7" />
                </svg>
                <span className="logo-words">
                  <span className="logo-text">Osiedle Łazarz</span>
                  <span className="logo-subtitle">Spółdzielnia Mieszkaniowa</span>
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Nawigacja główna">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link ${item.icon ? 'nav-link-admin' : ''} ${isActive(item.path) ? 'active' : ''}`}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-button"
            onClick={toggleMobileMenu}
            type="button"
            aria-label={isMobileMenuOpen ? 'Zamknij menu' : 'Otwórz menu'}
            aria-controls="mobile-navigation"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>

        {/* Mobile Navigation */}
        <nav id="mobile-navigation" className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Nawigacja mobilna" inert={!isMobileMenuOpen}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={closeMobileMenu}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </header>}

      <main className="main-content">
        <Outlet context={{ setAdminDashboard }} />
      </main>

      {!adminDashboard && <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Link to="/" className="footer-logo">
                <svg width="30" height="30" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M3 28h26M6 28V14l8-6.5 8 6.5v14M22 28V12l4 3v13M11 28v-7h6v7" />
                </svg>
                <span>Osiedle Łazarz</span>
              </Link>
              <p>Miejsce z historią, ludźmi i dobrą energią. Informacje i sąsiedzkie sprawy w jednym miejscu.</p>
            </div>
            <nav className="footer-column" aria-labelledby="footer-quick-heading">
              <h2 id="footer-quick-heading" className="footer-heading">Na skróty</h2>
              <Link to="/">Strona główna</Link>
              <Link to="/announcements">Ogłoszenia</Link>
              <Link to="/documents">Dokumenty</Link>
              <Link to="/contact">Kontakt</Link>
            </nav>
            <nav className="footer-column" aria-labelledby="footer-community-heading">
              <h2 id="footer-community-heading" className="footer-heading">Społeczność</h2>
              <Link to="/rada-osiedla">Rada Osiedla</Link>
              <Link to="/employees">Nasz zespół</Link>
              <Link to="/gallery">Galeria zdjęć</Link>
              <a href="https://www.klubkrag.pl/" target="_blank" rel="noopener noreferrer">Klub Osiedlowy KRĄG ↗</a>
            </nav>
            <div className="footer-column">
              <h2 className="footer-heading">Kontakt</h2>
              <address className="footer-address">
                <p>ul. Potockiej 37<br />60-211 Poznań</p>
                <a href="tel:612345678">61 234 56 78</a>
                <a href="mailto:biuro@osiedlelazarz.pl">biuro@osiedlelazarz.pl</a>
              </address>
            </div>
          </div>
          <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Osiedle Łazarz. Wszelkie prawa zastrzeżone.</p>
          <p className="footer-subtitle">Portal Osiedlowy</p>
          </div>
        </div>
      </footer>}
    </div>
  );
}

export default Layout;
