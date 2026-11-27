import { Link } from 'react-router-dom';
import './Faq.css';

const FAQ_ITEMS = [
  {
    question: 'Gdzie znajdę regulamin osiedla?',
    answer: (
      <>
        Regulaminy obowiązujące na osiedlu są dostępne w zakładce{' '}
        <Link to="/documents">Dokumenty</Link>. Wydrukowaną wersję można również otrzymać w biurze administracji.
      </>
    ),
  },
  {
    question: 'Jak mogę skontaktować się z administracją?',
    answer: (
      <>
        Zadzwoń pod numer <a href="tel:612345678">61 234 56 78</a>, napisz na adres{' '}
        <a href="mailto:administracja@osiedlelazarz.pl">administracja@osiedlelazarz.pl</a> lub skorzystaj z{' '}
        <Link to="/contact">formularza kontaktowego</Link>. Biuro jest czynne od poniedziałku do piątku w godzinach 8:00 – 16:00.
      </>
    ),
  },
  {
    question: 'Gdzie znajdę harmonogram spotkań?',
    answer: (
      <>
        Terminy spotkań Rady Osiedla (pierwszy czwartek miesiąca o 18:00) oraz zebrań mieszkańców znajdziesz w zakładkach{' '}
        <Link to="/rada-osiedla">Rada Osiedla</Link> i <Link to="/announcements">Ogłoszenia</Link>.
      </>
    ),
  },
  {
    question: 'Jak zgłosić problem techniczny?',
    answer: (
      <>
        W nagłych przypadkach (awaria wody, prądu, ogrzewania) dzwoń do pogotowia technicznego:{' '}
        <a href="tel:500123456">500 123 456</a>. Pozostałe usterki zgłoś przez{' '}
        <Link to="/contact">formularz kontaktowy</Link> lub telefonicznie w biurze administracji.
      </>
    ),
  },
  {
    question: 'Gdzie znajdę oficjalne dokumenty i formularze?',
    answer: (
      <>
        Oficjalne dokumenty, formularze i protokoły ze spotkań są dostępne w zakładce{' '}
        <Link to="/documents">Dokumenty</Link>, gdzie możesz je przeglądać i pobierać.
      </>
    ),
  },
];

function DisclosureIcon() {
  return (
    <svg
      className="faq-disclosure-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14" />
      <path className="faq-icon-vertical" d="M12 5v14" />
    </svg>
  );
}

function Faq() {
  return (
    <section className="faq-section" aria-labelledby="faq-title">
      <div className="faq-inner">
        <header className="faq-header">
          <h2 id="faq-title" className="faq-title">Najczęściej zadawane pytania</h2>
          <p className="faq-subtitle">
            Znajdź odpowiedzi na najczęściej zadawane pytania dotyczące naszego osiedla
          </p>
        </header>

        <div className="faq-list">
          {FAQ_ITEMS.map((item) => (
              <details key={item.question} className="faq-item" name="homepage-faq">
                  <summary className="faq-question">
                    <span className="faq-question-text">{item.question}</span>
                    <DisclosureIcon />
                  </summary>
                <div className="faq-answer">
                    <p className="faq-answer-text">{item.answer}</p>
                </div>
              </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Faq;
