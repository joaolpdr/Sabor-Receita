import { useState, useEffect } from 'react';
import RecipeCard from '../components/RecipeCard';
import localRecipes from '../data/recipes';
import { fetchRecipes } from '../services/recipeService';
import { searchMeals } from '../services/mealdbService';
import './Recipes.css';

/**
 * Normaliza uma receita vinda do backend para o formato
 * interno dos componentes do app.
 * Prefixamos o id com "admin-" para evitar colisão com
 * os IDs dos dados estáticos locais (1–4).
 */
function normalizeApiRecipe(r) {
  return {
    id: `admin-${r.id}`,
    title: r.title,
    image: r.image_url && r.image_url.startsWith('/')
      ? `http://localhost:5001${r.image_url}`
      : (r.image_url || 'https://placehold.co/400x300/fdebd4/9c5b3e?text=Sem+Foto'),
    category: ['Cadastrada'],
    rating: 5.0,
    chef: 'Admin',
    prepTime: '—',
    description: r.description,
  };
}

function Recipes() {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');

  // Receitas do backend (painel admin)
  const [adminRecipes, setAdminRecipes] = useState([]);

  // Estados para integração com a API externa (TheMealDB)
  const [apiResults, setApiResults] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isApiMode, setIsApiMode] = useState(false);

  // Unifica receitas locais + do backend
  const allLocalRecipes = [...localRecipes, ...adminRecipes];
  const categories = ['Todas', ...new Set(allLocalRecipes.flatMap((r) => r.category))];

  /**
   * Busca receitas cadastradas pelo admin no backend ao montar a página.
   * Usa o recipeService para manter a separação de responsabilidades.
   */
  useEffect(() => {
    fetchRecipes()
      .then((data) => {
        const normalized = data.map(normalizeApiRecipe);
        setAdminRecipes(normalized);
      })
      .catch(() => {
        // Backend offline: catálogo local continua funcionando normalmente
      });
  }, []);

  // Filtro no catálogo local + admin
  const filteredLocal = allLocalRecipes.filter((recipe) => {
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      categoryFilter === 'Todas' || recipe.category.includes(categoryFilter);
    return matchSearch && matchCategory;
  });

  /**
   * useEffect com debounce: busca na TheMealDB quando o termo
   * tem 3+ caracteres. Cancela a requisição anterior se o
   * usuário ainda estiver digitando (cleanup do timer).
   */
  useEffect(() => {
    if (search.trim().length < 3) {
      setIsApiMode(false);
      setApiResults([]);
      setApiError('');
      return;
    }

    setIsApiMode(true);
    setIsLoadingApi(true);
    setApiError('');

    const debounceTimer = setTimeout(async () => {
      try {
        const results = await searchMeals(search);
        setApiResults(results);
      } catch {
        setApiError('Não foi possível buscar na API externa. Mostrando resultados locais.');
        setIsApiMode(false);
      } finally {
        setIsLoadingApi(false);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const displayedRecipes = isApiMode ? apiResults : filteredLocal;

  return (
    <main className="recipes-page">

      <div className="recipes-hero-strip">
        <div className="recipes-hero-inner">
          <p className="recipes-eyebrow">🍳 Catálogo completo</p>
          <h1 className="recipes-title">Todas as Receitas</h1>
          <p className="recipes-subtitle">
            Descubra sabores do mundo inteiro. Filtre por categoria ou busque
            sua receita favorita — incluindo receitas internacionais via API.
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
              placeholder="Buscar receita… (3+ letras busca na API)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="clear-btn" onClick={() => setSearch('')}>✕</button>
            )}
          </div>

          {!isApiMode && (
            <div className="category-chips">
              {categories.map((cat) => (
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
          )}
        </div>

        {/* Banner modo busca global */}
        {isApiMode && (
          <div className="api-mode-banner">
            🌐 <strong>Busca global ativa</strong> — resultados vindos da API TheMealDB
            <button className="api-mode-clear" onClick={() => setSearch('')}>
              Voltar ao catálogo local
            </button>
          </div>
        )}

        {apiError && <p className="api-error-msg">⚠️ {apiError}</p>}

        {isLoadingApi && (
          <div className="api-loading">
            <div className="spinner" />
            <p>Buscando receitas na API…</p>
          </div>
        )}

        {/* Contagem */}
        {!isLoadingApi && (
          <div className="results-bar">
            <p className="results-count">
              <strong>{displayedRecipes.length}</strong>{' '}
              receita{displayedRecipes.length !== 1 ? 's' : ''}{' '}
              encontrada{displayedRecipes.length !== 1 ? 's' : ''}
              {isApiMode && <span className="active-filter"> via <em>TheMealDB</em></span>}
              {!isApiMode && categoryFilter !== 'Todas' && (
                <span className="active-filter"> em <em>{categoryFilter}</em></span>
              )}
            </p>
          </div>
        )}

        {/* Grid */}
        {!isLoadingApi && (
          displayedRecipes.length > 0 ? (
            <div className="catalog-grid">
              {displayedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-emoji">🔍</span>
              <h3>Nenhuma receita encontrada</h3>
              <p>Tente outro termo ou categoria.</p>
              <button
                className="btn-reset"
                onClick={() => { setSearch(''); setCategoryFilter('Todas'); }}
              >
                Limpar filtros
              </button>
            </div>
          )
        )}
      </div>
    </main>
  );
}

export default Recipes;
