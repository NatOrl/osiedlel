import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    e.target.setCustomValidity('');
    setSubmitStatus(null);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, value.trim()])
    );
    const emptyField = Object.keys(trimmedData).find((key) => !trimmedData[key]);
    if (emptyField) {
      const field = e.currentTarget.elements.namedItem(emptyField);
      field.setCustomValidity('Uzupełnij to pole — wpisz więcej niż same spacje.');
      field.reportValidity();
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact-messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trimmedData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitStatus('error');
        setErrorMessage('Nie udało się wysłać wiadomości. Spróbuj ponownie lub skontaktuj się z nami telefonicznie.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setErrorMessage('Nie udało się połączyć z serwerem. Spróbuj ponownie później.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <header className="page-header">
        <div className="header-inner">
          <nav className="breadcrumb" aria-label="Ścieżka nawigacji">
            <Link to="/" className="breadcrumb-link">Strona główna</Link>
            <span className="breadcrumb-separator" aria-hidden="true">›</span>
            <span className="breadcrumb-current" aria-current="page">Kontakt</span>
          </nav>
          <div className="header-content">
            <div className="header-text">
              <h1 className="page-title">Kontakt</h1>
              <div className="accent-line" aria-hidden="true"></div>
              <p className="page-description">
                Masz pytanie, sprawę lub pomysł dotyczący naszego osiedla? Skontaktuj się z nami — chętnie pomożemy.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="contact-container">
        <section className="contact-info-section" aria-label="Dane kontaktowe administracji">
          <div className="info-card">
            <div className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z" />
                <circle cx="12" cy="10" r="2.5" />
              </svg>
            </div>
            <h2>Adres</h2>
            <p>Osiedle Łazarz</p>
            <p>ul. Potockiej 37</p>
            <p>60-211 Poznań</p>
          </div>

          <div className="info-card">
            <div className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="m7 3 3 5-2.5 2.5a15 15 0 0 0 6 6L16 14l5 3-1 4C10 22 2 14 3 4l4-1Z" />
              </svg>
            </div>
            <h2>Telefon</h2>
            <p><a href="tel:+48611234567">+48 61 123 45 67</a></p>
            <p>Pon–Pt: 8:00–16:00</p>
          </div>

          <div className="info-card">
            <div className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m3 6 9 7 9-7" />
              </svg>
            </div>
            <h2>Email</h2>
            <p><a href="mailto:biuro@osiedlelazarz.pl">biuro@osiedlelazarz.pl</a></p>
            <p><a href="mailto:administracja@osiedlelazarz.pl">administracja@osiedlelazarz.pl</a></p>
          </div>

          <div className="info-card">
            <div className="info-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
            </div>
            <h2>Godziny Otwarcia</h2>
            <p>Poniedziałek–Piątek</p>
            <p>8:00–16:00</p>
            <p>Sobota–Niedziela: Nieczynne</p>
          </div>
        </section>

        <section className="contact-form-section" aria-labelledby="contact-form-title">
          <div className="contact-form-intro">
            <p className="contact-form-eyebrow">Porozmawiajmy</p>
            <h2 id="contact-form-title">Wyślij Wiadomość</h2>
            <p className="contact-form-description">Napisz do administracji osiedla. Odpowiemy najszybciej, jak to możliwe, zwykle w ciągu dwóch dni roboczych.</p>
            <div className="contact-email-alternative">
              <span className="contact-email-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 6 9 7 9-7" />
                </svg>
              </span>
              <div className="contact-email-text">
                <p className="contact-email-label">Wolisz email?</p>
                <a href="mailto:biuro@osiedlelazarz.pl">biuro@osiedlelazarz.pl</a>
              </div>
            </div>
            <p className="contact-required-note" id="contact-required-note">Pola oznaczone * są wymagane.</p>
          </div>
          <div className="contact-form-card">
            <div aria-live="polite" aria-atomic="true">
          
            {submitStatus === 'success' && (
              <div className="alert alert-success" role="status">
                Wiadomość została wysłana pomyślnie! Skontaktujemy się z Tobą wkrótce.
              </div>
            )}
          
            {submitStatus === 'error' && (
              <div className="alert alert-error" role="alert">
                {errorMessage}
              </div>
            )}
          
            </div>
            <form onSubmit={handleSubmit} className="contact-form" aria-describedby="contact-required-note" aria-busy={isSubmitting}>
              <fieldset disabled={isSubmitting}>
                <legend className="contact-visually-hidden">Twoja wiadomość do administracji</legend>
                <div className="form-group">
                  <label htmlFor="name">Imię i Nazwisko *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Jan Kowalski"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="jan.kowalski@example.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Temat *</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Temat wiadomości"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Wiadomość *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    placeholder="Twoja wiadomość..."
                  ></textarea>
                </div>

              </fieldset>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Wysyłanie...' : 'Wyślij Wiadomość'}
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Map Section */}
      <section className="map-section" aria-labelledby="contact-map-title">
        <div className="map-section-inner">
          <div className="map-section-header">
            <div className="map-heading-group">
              <p className="map-eyebrow">Odwiedź nas</p>
              <h2 className="map-title" id="contact-map-title">Jak do nas trafić</h2>
            </div>
            <p className="map-description">Biuro administracji znajduje się przy ul. Potockiej 37 w Poznaniu. Wejście jest dostępne od strony ulicy.</p>
          </div>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2434.0!2d16.8998957!3d52.3905157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47045ad542c4e78b%3A0x2ae6deead16cedd6!2s%C5%81azarz.+Administracja+osiedla!5e0!3m2!1spl!2spl!4v1234567890!5m2!1spl!2spl"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa lokalizacji - Łazarz. Administracja osiedla"
          ></iframe>
          <div className="map-link">
            <a 
              href="https://www.google.com/maps/place/%C5%81azarz.+Administracja+osiedla/@52.3905157,16.8973208,17z/data=!3m1!4b1!4m6!3m5!1s0x47045ad542c4e78b:0x2ae6deead16cedd6!8m2!3d52.3905157!4d16.8998957!16s%2Fg%2F1tfkzx90?hl=pl&entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Otwórz w Google Maps →
            </a>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
