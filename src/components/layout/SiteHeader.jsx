import { useEffect, useRef, useState } from 'react';
import { company } from '../../config/company';
import Arrow from '../ui/ArrowIcon';
import './SiteHeader.css';

const navigation = [
  {
    label: 'Study abroad',
    id: 'study',
    links: [
      { label: 'Study destinations', href: company.destinationsUrl, detail: 'Find a place for your ambitions' },
      { label: 'The student journey', href: company.studentUrl, detail: 'Understand your next steps' },
      { label: 'Talk to a counsellor', href: company.contactUrl, detail: 'Get personal guidance' },
    ],
  },
  { label: 'Services', href: company.servicesUrl },
  { label: 'About Hitouch', href: company.aboutUrl },
  {
    label: 'Partners',
    id: 'partners',
    links: [
      { label: 'Recruitment agents', href: company.agentsUrl, detail: 'Grow with our team' },
      { label: 'Educational institutions', href: company.institutionsUrl, detail: 'Connect with future students' },
    ],
  },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const headerRef = useRef(null);
  const toggleRef = useRef(null);
  const navRef = useRef(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    function handleOutsideClick(event) {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setMobileOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key !== 'Escape') return;

      if (openDropdown) {
        event.preventDefault();
        dropdownRefs.current[openDropdown]?.focus();
        setOpenDropdown(null);
      } else if (mobileOpen) {
        event.preventDefault();
        toggleRef.current?.focus();
        setMobileOpen(false);
      }
    }

    document.addEventListener('pointerdown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('pointerdown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [mobileOpen, openDropdown]);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 1050px)');
    function closeAtBreakpoint(event) {
      if (event.matches && navRef.current?.contains(document.activeElement)) {
        toggleRef.current?.focus();
      } else if (!event.matches && document.activeElement === toggleRef.current) {
        dropdownRefs.current.study?.focus();
      }
      setMobileOpen(false);
      setOpenDropdown(null);
    }
    mobileQuery.addEventListener('change', closeAtBreakpoint);
    return () => mobileQuery.removeEventListener('change', closeAtBreakpoint);
  }, []);

  function closeNavigation() {
    setMobileOpen(false);
    setOpenDropdown(null);
  }

  return (
    <header ref={headerRef} className="site-header" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) closeNavigation();
    }}>
      <div className="site-header__utility">
        <div className="site-header__utility-inner">
          <p className="site-header__tagline">International education. Personal guidance.</p>
          <div className="site-header__utility-links">
            <a href={company.contactUrl}>Contact us</a>
            <span className="site-header__utility-divider" aria-hidden="true" />
            <a href={company.portalUrl}>Student portal <Arrow diagonal /></a>
          </div>
        </div>
      </div>

      <div className="site-header__main">
        <a className="site-header__brand" href="/" aria-label="Hitouch Global — home" onClick={closeNavigation}>
          <img src="/images/logo.png" width="2007" height="708" alt="Hitouch Global Ltd" />
        </a>

        <button
          className="site-header__toggle"
          type="button"
          ref={toggleRef}
          aria-expanded={mobileOpen}
          aria-controls="primary-navigation"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setOpenDropdown(null);
          }}
        >
          <span>{mobileOpen ? 'Close' : 'Menu'}</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            {mobileOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>

        <nav ref={navRef} id="primary-navigation" aria-label="Main navigation" className={`site-header__navigation${mobileOpen ? ' is-open' : ''}`}>
          <ul className="site-header__links">
            {navigation.map((item) => (
              <li className="site-header__nav-item" key={item.label}>
                {item.links ? (
                  <>
                    <button
                      className="site-header__link site-header__disclosure"
                      ref={(element) => { dropdownRefs.current[item.id] = element; }}
                      type="button"
                      aria-expanded={openDropdown === item.id}
                      aria-controls={`navigation-${item.id}`}
                      onClick={() => setOpenDropdown(openDropdown === item.id ? null : item.id)}
                    >
                      {item.label}
                      <svg className="site-header__chevron" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
                    </button>
                    <ul className="site-header__dropdown" id={`navigation-${item.id}`} hidden={openDropdown !== item.id}>
                      {item.links.map((link) => (
                        <li key={link.href}>
                          <a href={link.href} onClick={closeNavigation}>
                            <span className="site-header__dropdown-label">{link.label}<Arrow diagonal /></span>
                            <span className="site-header__dropdown-detail">{link.detail}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : (
                  <a className="site-header__link" href={item.href} onClick={closeNavigation}>{item.label}</a>
                )}
              </li>
            ))}
          </ul>
          <a className="site-header__contact" href={company.contactUrl} onClick={closeNavigation}>
            Let’s talk <Arrow />
          </a>
        </nav>
      </div>
    </header>
  );
}
