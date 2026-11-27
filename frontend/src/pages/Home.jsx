import React from 'react';
import ImportantNotices from '../components/ImportantNotices';
import LatestNews from '../components/LatestNews';
import QuickAccess from '../components/QuickAccess';
import EstateAdministration from '../components/EstateAdministration';
import CommunityClub from '../components/CommunityClub';
import Faq from '../components/Faq';
import CommunitySection from '../components/CommunitySection';
import ResidentInfo from '../components/ResidentInfo';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="hero-eyebrow">Tutaj jesteśmy u siebie</p>
          <h1 className="hero-title" id="hero-title">Witamy w Osiedlu<br />Łazarz</h1>
          <p className="hero-subtitle">
            Miejsce z historią, ludźmi i dobrą energią. Bądź na bieżąco z życiem osiedla i twórz z nami sąsiedzką społeczność.
          </p>
          {/* <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-icon">Ä‘Ĺşâ€Ä„</span>
              <div className="stat-info">
                <h3>SpoÄąâ€šecznoÄąâ€şĂ„â€ˇ</h3>
                <p>PoÄąâ€šĂ„â€¦czeni mieszkaÄąâ€žcy</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">Ä‘Ĺşâ€śË</span>
              <div className="stat-info">
                <h3>AktualnoÄąâ€şci</h3>
                <p>Najnowsze ogÄąâ€šoszenia</p>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">Ä‘Ĺşâ€śâ€ž</span>
              <div className="stat-info">
                <h3>Dokumenty</h3>
                <p>Oficjalne zasoby</p>
              </div>
            </div>
          </div> */}
        </div>
      </section>

      <ImportantNotices />

      <LatestNews />

      <QuickAccess />

      <CommunitySection />

      <ResidentInfo />

      <EstateAdministration />

      <CommunityClub />

      <Faq />
    </div>
  );
}

export default Home;


