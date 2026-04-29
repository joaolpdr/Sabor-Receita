import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/recipes';
import './Home.css';

function Home() {
  const featured = recipes[0];
  const grid = recipes.slice(1);

  const stats = [
    { num: '200+', label: 'Receitas' },
    { num: '50+',  label: 'Chefs' },
    { num: '4.8★', label: 'Avaliação média' },
  ];

  const categories = [
    { emoji: '🍝', name: 'Massas',         bg: '#fff0e6' },
    { emoji: '🥩', name: 'Carnes',         bg: '#ffe6e6' },
    { emoji: '🍣', name: 'Frutos do Mar',  bg: '#e6f3ff' },
    { emoji: '🍔', name: 'Lanches',        bg: '#e6ffe6' },
    { emoji: '🥗', name: 'Saladas',        bg: '#f0ffe6' },
    { emoji: '🍰', name: 'Sobremesas',     bg: '#ffe6f5' },
  ];

  return (
    <main className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">🍳 Plataforma de Receitas</span>
          <h1 className="hero-heading">
            Desperte o<br/>
            <span className="hero-highlight">Chef</span> que há<br/>
            em você
          </h1>
          <p className="hero-sub">
            Explore centenas de receitas autênticas, criadas por chefs renomados.
            Do café da manhã ao jantar, encontre inspiração para cada momento.
          </p>
          <div className="hero-actions">
            <Link to="/receitas" className="btn-primary">Ver Receitas</Link>
            <Link to={`/receita/${featured.id}`} className="btn-secondary">Receita do dia</Link>
          </div>
          <div className="hero-stats">
            {stats.map(s => (
              <div key={s.label} className="stat">
                <strong>{s.num}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-featured">
            <img src={featured.image} alt={featured.title} className="hero-img" />
            <div className="hero-card-info">
              <div className="hero-card-top">
                {featured.category.map(c => <span key={c} className="hero-cat">{c}</span>)}
                <span className="hero-rating">★ {featured.rating}</span>
              </div>
              <h3 className="hero-card-title">{featured.title}</h3>
              <div className="hero-card-meta">
                <span>⏱ {featured.prepTime}</span>
                <span>👨‍🍳 Chef {featured.chef}</span>
              </div>
            </div>
          </div>
          <div className="hero-decoration">
            <div className="deco-pill deco-1">✨ Receita exclusiva</div>
            <div className="deco-pill deco-2">🔥 Em alta</div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Navegue por tipo</p>
              <h2 className="section-title">Categorias populares</h2>
            </div>
            <Link to="/receitas" className="link-see-all">Ver todas →</Link>
          </div>
          <div className="categories-grid">
            {categories.map(c => (
              <Link to="/receitas" key={c.name} className="category-card" style={{ '--cat-bg': c.bg }}>
                <span className="cat-emoji">{c.emoji}</span>
                <span className="cat-name">{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RECEITAS EM DESTAQUE ── */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Selecionadas por nossos chefs</p>
              <h2 className="section-title">Receitas em destaque</h2>
            </div>
            <Link to="/receitas" className="link-see-all">Ver todas →</Link>
          </div>
          <div className="recipes-grid">
            {grid.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BANNER CTA ── */}
      <section className="cta-banner">
        <div className="cta-inner">
          <div className="cta-text">
            <h2>Pronto para cozinhar algo incrível?</h2>
            <p>Acesse nosso catálogo completo com receitas para todos os gostos e níveis de habilidade.</p>
          </div>
          <Link to="/receitas" className="btn-primary btn-large">Explorar Catálogo</Link>
        </div>
      </section>

    </main>
  );
}

export default Home;
