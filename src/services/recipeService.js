/**
 * recipeService.js
 * Camada de serviço responsável por todas as chamadas
 * HTTP relacionadas ao backend próprio da aplicação.
 *
 * Separar a lógica de fetch dos componentes garante:
 *  - Reutilização das funções em qualquer parte do app
 *  - Fácil manutenção (um único lugar para alterar a base URL)
 *  - Componentes mais limpos (só lidam com estado/UI)
 */

const API_BASE_URL = 'http://localhost:5001/api';

/**
 * Realiza o login do administrador.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{token: string}>}
 */
export async function loginAdmin(username, password) {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Erro ao fazer login');
  }

  return data; // { token }
}

/**
 * Busca todas as receitas cadastradas no backend.
 * @returns {Promise<Array>}
 */
export async function fetchRecipes() {
  const response = await fetch(`${API_BASE_URL}/recipes`);

  if (!response.ok) {
    throw new Error('Erro ao buscar receitas');
  }

  return response.json(); // Array de receitas
}

/**
 * Adiciona uma nova receita ao backend.
 * Usa FormData para suportar o envio de arquivo de imagem.
 * @param {{ title: string, description: string, imageFile: File|null }} data
 * @returns {Promise<Object>} receita criada
 */
export async function addRecipe({ title, description, imageFile }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description);
  if (imageFile) {
    formData.append('image', imageFile);
  }

  const response = await fetch(`${API_BASE_URL}/recipes`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Erro ao salvar receita');
  }

  return response.json();
}
