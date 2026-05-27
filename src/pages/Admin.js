import React, { useState, useEffect } from 'react';
import { loginAdmin, fetchRecipes, addRecipe } from '../services/recipeService';
import './Admin.css';

/**
 * Regras de validação do formulário de login.
 * Retorna um objeto com mensagens de erro por campo.
 */
function validateLoginForm({ username, password }) {
  const errors = {};
  if (!username.trim()) errors.username = 'O usuário é obrigatório.';
  if (!password) errors.password = 'A senha é obrigatória.';
  else if (password.length < 4) errors.password = 'A senha deve ter ao menos 4 caracteres.';
  return errors;
}

/**
 * Regras de validação do formulário de nova receita.
 */
function validateRecipeForm({ title, description }) {
  const errors = {};
  if (!title.trim()) errors.title = 'O título é obrigatório.';
  else if (title.trim().length < 3) errors.title = 'O título deve ter ao menos 3 caracteres.';
  if (!description.trim()) errors.description = 'A descrição é obrigatória.';
  else if (description.trim().length < 10) errors.description = 'Descreva a receita com ao menos 10 caracteres.';
  return errors;
}

function Admin() {
  // --- Estado de autenticação ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginFieldErrors, setLoginFieldErrors] = useState({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Estado do formulário de receita ---
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [recipeFieldErrors, setRecipeFieldErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- Lista de receitas do backend ---
  const [recipes, setRecipes] = useState([]);

  // Verifica token salvo ao montar o componente (persistência de sessão)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      loadRecipes();
    }
  }, []);

  /**
   * Carrega as receitas via serviço (fetch ao backend).
   * Em caso de falha, usa dados de exemplo para não travar a UI.
   */
  async function loadRecipes() {
    try {
      const data = await fetchRecipes();
      setRecipes(data);
    } catch {
      setRecipes([
        { id: 1, title: 'Bolo de Cenoura (Exemplo — backend offline)', description: 'O backend não está rodando.', image_url: '' },
      ]);
    }
  }

  /**
   * Submissão do login.
   * Valida os campos ANTES de enviar a requisição HTTP.
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');

    // 1. Validação local (feedback imediato sem requisição)
    const errors = validateLoginForm({ username, password });
    setLoginFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // 2. Requisição via serviço (separação de responsabilidades)
    setIsLoggingIn(true);
    try {
      const data = await loginAdmin(username, password);
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      loadRecipes();
    } catch (err) {
      // Fallback offline para demonstração sem backend
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('token', 'simulated_token_123');
        setIsLoggedIn(true);
        loadRecipes();
      } else {
        setLoginError('Credenciais inválidas ou servidor indisponível.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  /**
   * Submissão do formulário de nova receita.
   * Valida, envia via serviço e atualiza a lista local.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage('');
    setSubmitError('');

    // 1. Validação local
    const errors = validateRecipeForm({ title, description });
    setRecipeFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // 2. Envio via serviço
    setIsSaving(true);
    try {
      const newRecipe = await addRecipe({ title, description, imageFile });
      setSubmitMessage('✅ Receita adicionada com sucesso!');
      setRecipes((prev) => [...prev, newRecipe]);
    } catch {
      // Fallback: simula a adição localmente
      setSubmitError('Backend offline — receita adicionada localmente (não persiste).');
      setRecipes((prev) => [
        ...prev,
        { id: Math.random(), title, description, image_url: imagePreview },
      ]);
    } finally {
      setIsSaving(false);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      setRecipeFieldErrors({});
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // ── TELA DE LOGIN ──────────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-form" onSubmit={handleLogin} noValidate>
          <h2>Login Admin</h2>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
            Dica: use <strong>admin / admin</strong>
          </p>

          {loginError && <p className="error-msg">{loginError}</p>}

          <div className="form-group">
            <label htmlFor="admin-username">Usuário</label>
            <input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (loginFieldErrors.username) setLoginFieldErrors((p) => ({ ...p, username: '' }));
              }}
              className={loginFieldErrors.username ? 'input-error' : ''}
              aria-describedby="username-error"
            />
            {loginFieldErrors.username && (
              <span id="username-error" className="field-error">{loginFieldErrors.username}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (loginFieldErrors.password) setLoginFieldErrors((p) => ({ ...p, password: '' }));
              }}
              className={loginFieldErrors.password ? 'input-error' : ''}
              aria-describedby="password-error"
            />
            {loginFieldErrors.password && (
              <span id="password-error" className="field-error">{loginFieldErrors.password}</span>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isLoggingIn}>
            {isLoggingIn ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h2>Painel de Controle</h2>
        <button onClick={handleLogout} className="btn-secondary">Sair</button>
      </header>

      <div className="admin-content">
        <section className="add-recipe-section">
          <h3>Adicionar Nova Receita</h3>

          {submitMessage && <p className="success-msg">{submitMessage}</p>}
          {submitError && <p className="error-msg">{submitError}</p>}

          <form className="admin-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="recipe-title">Título</label>
              <input
                id="recipe-title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (recipeFieldErrors.title) setRecipeFieldErrors((p) => ({ ...p, title: '' }));
                }}
                className={recipeFieldErrors.title ? 'input-error' : ''}
                aria-describedby="title-error"
              />
              {recipeFieldErrors.title && (
                <span id="title-error" className="field-error">{recipeFieldErrors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="recipe-description">Descrição</label>
              <textarea
                id="recipe-description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (recipeFieldErrors.description) setRecipeFieldErrors((p) => ({ ...p, description: '' }));
                }}
                className={recipeFieldErrors.description ? 'input-error' : ''}
                rows="4"
                aria-describedby="description-error"
              />
              {recipeFieldErrors.description && (
                <span id="description-error" className="field-error">{recipeFieldErrors.description}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="recipe-image">Imagem</label>
              <input
                id="recipe-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <p>Preview:</p>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? 'Salvando…' : 'Salvar Receita'}
            </button>
          </form>
        </section>

        <section className="recipes-list-section">
          <h3>Receitas Cadastradas</h3>
          <div className="recipes-list">
            {recipes.map((recipe) => (
              <div key={recipe.id} className="recipe-list-item">
                <div className="recipe-list-info">
                  <h4>{recipe.title}</h4>
                  <p>{recipe.description.substring(0, 60)}…</p>
                </div>
                {recipe.image_url && (
                  <img
                    src={
                      recipe.image_url.startsWith('data')
                        ? recipe.image_url
                        : `http://localhost:5001${recipe.image_url}`
                    }
                    alt={recipe.title}
                  />
                )}
              </div>
            ))}
            {recipes.length === 0 && <p>Nenhuma receita encontrada.</p>}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Admin;
