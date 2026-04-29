import { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import recipes from '../data/recipes';
import './Recipes.css';

function Recipes() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  const categories = ['Todas', ...new Set(recipes.flatMap(r => r.category))];

  const filtered = recipes.filter(recipe => {
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter === 'Todas' || recipe.category.includes(categoryFilter);
    return matchSearch && matchCategory;
  });

  return (
    <main className="recipes-page">

      {/* Topo hero strip */}
      <div className="recipes-hero-strip">
        <div className="recipes-hero-inner">
          <p className="recipes-eyebrow">🍳 Catálogo completo</p>
          <h1 className="recipes-title">Todas as Receitas</h1>
          <p className="recipes-subtitle">
            Descubra sabores do mundo inteiro. Filtre por categoria ou busque sua receita favorita.
          </p>
        </div>
      </div>

      <div className="recipes-container">

        {/* Filtros */}
        <div className="filters-bar">
          <div className="search-wrap">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id="recipe-search"
              type="text"
              placeholder="Buscar receita..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          <div className="category-chips">
            {categories.map(cat => (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
                onClick={() => setCategoryFilter(cat)}
                className={`chip ${categoryFilter === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Contagem */}
        <div className="results-bar">
          <p className="results-count">
            <strong>{filtered.length}</strong> receita{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
            {categoryFilter !== 'Todas' && <span className="active-filter"> em <em>{categoryFilter}</em></span>}
          </p>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="catalog-grid">
            {filtered.map(recipe => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-emoji">🔍</span>
            <h3>Nenhuma receita encontrada</h3>
            <p>Tente outro termo ou categoria.</p>
            <button className="btn-reset" onClick={() => { setSearch(''); setCategoryFilter('Todas'); }}>
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

export default Recipes;
