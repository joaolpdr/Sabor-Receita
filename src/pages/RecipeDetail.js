import { useParams, Link } from 'react-router-dom';
import recipes from '../data/recipes';
import './RecipeDetail.css';

function RecipeDetail() {
  const { id } = useParams();
  const recipe = recipes.find((r) => r.id === parseInt(id, 10));
  const related = recipes.filter(r => r.id !== parseInt(id, 10)).slice(0, 2);

  if (!recipe) {
    return (
      <main className="detail-page">
        <div className="not-found">
          <span className="not-found-icon">🍽️</span>
          <h2>Receita não encontrada</h2>
          <p>A receita que você procura não existe ou foi removida.</p>
          <Link to="/receitas" className="btn-back">← Voltar para Receitas</Link>
        </div>
      </main>
    );
  }

  const infoCards = [
    { icon: '⏱️', label: 'Tempo de preparo', value: recipe.prepTime },
    { icon: '⭐', label: 'Avaliação', value: `${recipe.rating.toFixed(1)} / 5.0` },
    { icon: '🗳️', label: 'Votos', value: `${recipe.votes.toLocaleString('pt-BR')} avaliações` },
    { icon: '🌍', label: 'Culinária', value: recipe.category.join(', ') },
  ];

  return (
    <main className="detail-page">

      {/* Hero com imagem */}
      <div
        className="detail-hero"
        style={{ '--hero-img': `url(${recipe.heroImage})` }}
      >
        <div className="detail-hero-overlay" />
        <div className="detail-hero-content">
          <Link to="/receitas" className="detail-back">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Voltar
          </Link>
          <div className="detail-cats">
            {recipe.category.map(c => <span key={c} className="detail-cat">{c}</span>)}
          </div>
          <h1 className="detail-title">{recipe.title}</h1>
          <p className="detail-chef">
            <span className="chef-avatar">👨‍🍳</span> Chef <strong>{recipe.chef}</strong>
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="detail-body">
        <div className="detail-main">

          {/* Info cards */}
          <div className="info-cards">
            {infoCards.map(c => (
              <div key={c.label} className="info-card">
                <span className="info-icon">{c.icon}</span>
                <div>
                  <p className="info-label">{c.label}</p>
                  <p className="info-value">{c.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Descrição */}
          <section className="detail-section">
            <h2 className="detail-section-title">Sobre esta receita</h2>
            <p className="detail-description">{recipe.description}</p>
          </section>

          {/* Ações */}
          <div className="detail-actions">
            {recipe.sourceUrl && (
              <a
                href={recipe.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-btn-primary"
              >
                🥘 Ver Receita Completa
              </a>
            )}
            {recipe.videoUrl && (
              <a
                href={recipe.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="detail-btn-secondary"
              >
                ▶ Assistir no YouTube
              </a>
            )}
          </div>
        </div>

        {/* Sidebar — receitas relacionadas */}
        {related.length > 0 && (
          <aside className="detail-sidebar">
            <h3 className="sidebar-title">Você também pode gostar</h3>
            <div className="related-list">
              {related.map(r => (
                <Link key={r.id} to={`/receita/${r.id}`} className="related-card">
                  <img src={r.image} alt={r.title} className="related-img"
                    onError={(e) => { e.target.src = 'https://placehold.co/100x80/fdebd4/9c5b3e?text=Foto'; }} />
                  <div className="related-info">
                    <p className="related-title">{r.title}</p>
                    <p className="related-meta">⏱ {r.prepTime} · ★ {r.rating}</p>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )}
      </div>
    </main>
  );
}

export default RecipeDetail;
