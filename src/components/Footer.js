import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-logo">
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="14" fill="#e8651a"/>
              <path d="M8 10c0-1.1.9-2 2-2h8a2 2 0 012 2v1H8v-1z" fill="white"/>
              <path d="M7 13h14l-1.5 8H8.5L7 13z" fill="white"/>
              <path d="M11 16h6M11 19h4" stroke="#e8651a" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span>Sabor<span className="footer-amp">&amp;</span>Receita</span>
          </div>
          <p className="footer-tagline">Descubra o sabor de cada momento.<br/>Receitas com alma, feitas com amor.</p>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h4>Navegação</h4>
            <Link to="/">Início</Link>
            <Link to="/receitas">Receitas</Link>
          </div>
          <div className="footer-col">
            <h4>Categorias</h4>
            <Link to="/receitas">Massas</Link>
            <Link to="/receitas">Brasileira</Link>
            <Link to="/receitas">Japonesa</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>Desenvolvido com ❤️ — Trabalho acadêmico · Disciplina Web Development: Framework</p>
        <p>Professora: Lisiane Reips · © {new Date().getFullYear()} Sabor &amp; Receita</p>
      </div>
    </footer>
  );
}

export default Footer;
