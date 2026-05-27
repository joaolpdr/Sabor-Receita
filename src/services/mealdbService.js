/**
 * mealdbService.js
 * Camada de serviço para consumo da API pública TheMealDB.
 * Documentação: https://www.themealdb.com/api.php
 *
 * Responsabilidades:
 *  - Encapsular as URLs e lógica de mapeamento de dados externos
 *  - Normalizar o formato da API para o padrão interno do app
 *  - Nunca expor detalhes da API para os componentes
 */

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';

/**
 * Normaliza um objeto de refeição da TheMealDB para o formato
 * interno utilizado pelos componentes do Sabor & Receita.
 * @param {Object} meal - objeto bruto da API
 * @returns {Object} receita no formato interno
 */
function normalizeMeal(meal) {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: [meal.strCategory || 'Internacional'],
    rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)), // Simulado: API não provê rating
    chef: meal.strArea || 'Internacional',
    prepTime: '~30 min', // TheMealDB não fornece tempo de preparo
    sourceUrl: meal.strSource || null,
    videoUrl: meal.strYoutube || null,
    description: meal.strInstructions
      ? meal.strInstructions.substring(0, 200) + '...'
      : 'Receita internacional disponível no link abaixo.',
    external: true, // flag para o RecipeCard identificar receitas externas
  };
}

/**
 * Busca receitas na TheMealDB pelo nome.
 * @param {string} term - termo de busca (mínimo 2 caracteres)
 * @returns {Promise<Array>} lista de receitas normalizadas
 */
export async function searchMeals(term) {
  if (!term || term.trim().length < 2) return [];

  const response = await fetch(
    `${MEALDB_BASE}/search.php?s=${encodeURIComponent(term.trim())}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar na TheMealDB');
  }

  const data = await response.json();
  const meals = data.meals || [];
  return meals.map(normalizeMeal);
}

/**
 * Busca receitas de uma categoria específica.
 * @param {string} category
 * @returns {Promise<Array>} lista de receitas (formato resumido)
 */
export async function fetchByCategory(category) {
  const response = await fetch(
    `${MEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar categoria na TheMealDB');
  }

  const data = await response.json();
  const meals = data.meals || [];

  // O endpoint de filter retorna versão resumida, normalizar parcialmente
  return meals.slice(0, 8).map((meal) => ({
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: [category],
    rating: parseFloat((4.0 + Math.random() * 0.9).toFixed(1)),
    chef: 'Internacional',
    prepTime: '~30 min',
    external: true,
  }));
}
