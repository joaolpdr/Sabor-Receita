import { useNavigate } from 'react-router-dom';
import './RecipeCard.css';

function RecipeCard({ recipe }) {
  const { id, title, prepTime, category, rating, image, chef } = recipe;
  const navigate = useNavigate();

  return (
    <div className="recipe-card" onClick={() => navigate(`/receita/${id}`)}>
      <div className="recipe-image-wrap">
        <img
          src={image}
          alt={`Foto de ${title}`}
          className="recipe-image"
          onError={(e) => { e.target.src = 'https://placehold.co/400x300/fdebd4/9c5b3e?text=Sem+Foto'; }}
        />
        <div className="recipe-img-overlay" />
        <div className="recipe-badges">
          {category.slice(0, 1).map((c) => (
            <span key={c} className="category-badge">{c}</span>
          ))}
        </div>
        <div className="recipe-rating-badge">
          <span className="star-icon">★</span>
          <span>{rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="recipe-body">
        <div className="recipe-meta-row">
          <span className="recipe-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
            </svg>
            {prepTime}
          </span>
          <span className="recipe-chef-small">Chef {chef}</span>
        </div>
        <h3 className="recipe-title">{title}</h3>
        <div className="recipe-card-footer">
          <div className="recipe-tags">
            {category.map((c) => (
              <span key={c} className="tag">{c}</span>
            ))}
          </div>
          <span className="recipe-see-more">Ver receita →</span>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;
