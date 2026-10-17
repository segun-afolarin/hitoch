import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import SiteHeader from './components/layout/SiteHeader';
import Hero from './components/home/Hero';

function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="site-container not-found">
      <p className="eyebrow">HITOUCH GLOBAL</p>
      <h1>Let’s get you back on course.</h1>
      <p>The page you’re looking for isn’t available at this address.</p>
      <Link className="button button-primary" to="/">Back to home</Link>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<main id="main-content" tabIndex={-1}><Hero /></main>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
