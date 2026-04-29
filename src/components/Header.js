import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const navLinks = [
    { path: '/', label: 'Início' },
    { path: '/receitas', label: 'Receitas' },
    { path: '/sobre', label: 'Sobre' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-inner">
        <Link to="/" className="header-logo">
          <div className="logo-mark">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#e8651a"/>
              <path d="M8 10c0-1.1.9-2 2-2h8a2 2 0 012 2v1H8v-1z" fill="white"/>
              <path d="M7 13h14l-1.5 8H8.5L7 13z" fill="white"/>
              <path d="M11 16h6M11 19h4" stroke="#e8651a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-text">Sabor<span className="logo-amp">&amp;</span>Receita</span>
        </Link>

        <nav className="header-nav">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`nav-link ${location.pathname === path ? 'active' : ''}`}
            >
              {label}
            </Link>
          ))}
          <Link to="/receitas" className="nav-cta">Explorar</Link>
        </nav>

        <button
          className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span/><span/><span/>
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} className={`mobile-link ${location.pathname === path ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
          <Link to="/receitas" className="mobile-cta">Explorar Receitas</Link>
        </div>
      )}
    </header>
  );
}

export default Header;
