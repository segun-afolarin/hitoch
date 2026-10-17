import { company } from '../../config/company';
import Arrow from '../ui/ArrowIcon';
import './Hero.css';

const support = [
  { number: '01', title: 'Find your direction', detail: 'Course & university guidance', href: company.studentUrl },
  { number: '02', title: 'Take the next step', detail: 'Admissions & visa support', href: company.servicesUrl },
  { number: '03', title: 'Prepare for your arrival', detail: 'Accommodation & travel assistance', href: company.servicesUrl },
];

export default function Hero() {
  return (
    <section className="home-hero" aria-labelledby="hero-heading">
      <div className="site-container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">YOUR STUDY ABROAD JOURNEY</p>
          <h1 id="hero-heading">
            Your ambition.<br />
            Our guidance.<br />
            <span className="hero-heading-accent">A world ahead.</span>
          </h1>
          <p className="hero-description">
            Big decisions feel better with the right people beside you.
            From choosing a course to preparing for life abroad,
            Hitouch helps you move forward with confidence.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href={company.contactUrl}>
              Talk to a counsellor <Arrow />
            </a>
            <a className="hero-explore" href={company.destinationsUrl}>
              Explore destinations <Arrow diagonal />
            </a>
          </div>
          <p className="hero-reassurance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M8.5 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm7 1a3 3 0 1 0 0-6M2 21v-3a6.5 6.5 0 0 1 13 0v3m3-8a5 5 0 0 1 4 5v3" />
            </svg>
            Real conversations. A plan built around you.
          </p>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit" aria-hidden="true"><span /></div>
          <div className="hero-image-frame">
            <img
              className="hero-image"
              src="/images/students-campus-1200.jpg"
              srcSet="/images/students-campus-640.jpg 640w, /images/students-campus-1200.jpg 1200w"
              sizes="(max-width: 760px) calc(100vw - 40px), (max-width: 1100px) 46vw, 580px"
              width="1200"
              height="800"
              fetchPriority="high"
              alt="Students with books walking together outside a campus building"
            />
            <div className="hero-image-shade" aria-hidden="true" />
            <div className="hero-image-caption">
              <span className="hero-caption-line" aria-hidden="true" />
              <p>A new place.<br /><strong>A future that’s yours.</strong></p>
            </div>
          </div>
          <div className="hero-note">
            <span className="hero-note-icon" aria-hidden="true">
              <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="16" cy="16" r="11" /><ellipse cx="16" cy="16" rx="5" ry="11" />
                <path d="M5 16h22M7 10h18M7 22h18" />
              </svg>
            </span>
            <div><p>GLOBAL POSSIBILITIES.</p><strong>Personal support.</strong></div>
            <span className="hero-note-dot" aria-hidden="true" />
          </div>
          <p className="hero-side-label" aria-hidden="true">EDUCATION OPENS WORLDS</p>
        </div>
      </div>
      <div className="hero-support-wrap">
        <div className="site-container hero-support">
          <p className="hero-support-intro">Every step.<br /><strong>Thoughtfully supported.</strong></p>
          <ul className="hero-support-list" aria-label="Explore support for your study journey">
            {support.map((item) => (
              <li key={item.number}>
                <a href={item.href} className="hero-support-link">
                  <span className="hero-support-number" aria-hidden="true">{item.number}</span>
                  <span><strong>{item.title}</strong><span className="hero-support-detail">{item.detail}</span></span>
                  <Arrow diagonal />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
