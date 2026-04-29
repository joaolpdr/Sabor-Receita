import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Sobre from './pages/Sobre';
import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/receitas" element={<Recipes />} />
          <Route path="/receita/:id" element={<RecipeDetail />} />
          <Route path="/sobre" element={<Sobre />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
