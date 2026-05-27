import React, { useState, useEffect } from 'react';
import './Admin.css';

function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchRecipes();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        setIsLoggedIn(true);
        fetchRecipes();
      } else {
        setLoginError(data.error || 'Erro no login');
      }
    } catch (error) {
      // Simulate login if API fails to fetch
      if (username === 'admin' && password === 'admin') {
         localStorage.setItem('token', 'simulated_token_123');
         setIsLoggedIn(true);
         fetchRecipes();
      } else {
         setLoginError('Erro de conexão e credenciais inválidas');
      }
    }
  };

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/recipes');
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      // Mock data
      setRecipes([{ id: 1, title: 'Receita Teste (Sem Backend)', description: 'O backend não está rodando.', image_url: '' }]);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('http://localhost:5001/api/recipes', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setSubmitMessage('Receita adicionada com sucesso!');
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
      fetchRecipes();
    } catch (error) {
      setSubmitMessage('Erro de conexão, simulando adição.');
      const newRecipe = {
         id: Math.random(),
         title,
         description,
         image_url: imagePreview
      };
      setRecipes([...recipes, newRecipe]);
      setTitle('');
      setDescription('');
      setImageFile(null);
      setImagePreview('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="admin-login-container">
        <form className="admin-form" onSubmit={handleLogin}>
          <h2>Login Admin</h2>
          {loginError && <p className="error-msg">{loginError}</p>}
          <div className="form-group">
            <label>Usuário</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Senha</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn-primary">Entrar</button>
          <p style={{marginTop: '10px', fontSize: '12px', color: '#666'}}>Dica: admin / admin</p>
        </form>
      </div>
    );
  }

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
          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Descrição</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} required rows="4" />
            </div>
            <div className="form-group">
              <label>Imagem</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {imagePreview && (
                <div className="image-preview">
                  <p>Preview:</p>
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <button type="submit" className="btn-primary">Salvar Receita</button>
          </form>
        </section>

        <section className="recipes-list-section">
          <h3>Receitas Cadastradas</h3>
          <div className="recipes-list">
            {recipes.map(recipe => (
              <div key={recipe.id} className="recipe-list-item">
                <div className="recipe-list-info">
                  <h4>{recipe.title}</h4>
                  <p>{recipe.description.substring(0, 50)}...</p>
                </div>
                {recipe.image_url && <img src={recipe.image_url.startsWith('data') ? recipe.image_url : `http://localhost:5001${recipe.image_url}`} alt={recipe.title} />}
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
