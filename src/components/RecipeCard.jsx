import { useState, useEffect } from "react";
import { getRecipeDetails } from "../services/api";
import "./RecipeCard.css";

function RecipeCard({ recipe }) {
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(saved.some((r) => r.id === recipe.id));
  }, [recipe.id]);

  // When card is clicked, fetch details and open fullscreen modal
  async function handleCardClick() {
    if (!details) {
      setLoadingDetails(true);
      const data = await getRecipeDetails(recipe.id);
      setDetails(data);
      setLoadingDetails(false);
    }
    setExpanded(true);
  }

  // Close the fullscreen modal
  function handleClose(e) {
    e.stopPropagation();
    setExpanded(false);
  }

  // Stop clicks inside modal content from closing it
  function handleModalContentClick(e) {
    e.stopPropagation();
  }

  function toggleFavorite(e) {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (isFavorite) {
      localStorage.setItem("favorites", JSON.stringify(saved.filter((r) => r.id !== recipe.id)));
      setIsFavorite(false);
    } else {
      saved.push({ id: recipe.id, title: recipe.title, image: recipe.image });
      localStorage.setItem("favorites", JSON.stringify(saved));
      setIsFavorite(true);
    }
  }

  function formatTime(minutes) {
    if (!minutes) return "N/A";
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  }

  return (
    <>

      <div className="recipe-card" onClick={handleCardClick}>
        <div className="card-image-wrapper">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="card-image"
            onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=No+Image"; }}
          />
        </div>

        <div className="card-body">
          <h2 className="card-title">{recipe.title}</h2>
          <div className="card-meta">
            {recipe.readyInMinutes && (
              <span className="meta-tag">⏱ {formatTime(recipe.readyInMinutes)}</span>
            )}
            {recipe.servings && (
              <span className="meta-tag">🍽 {recipe.servings} servings</span>
            )}
            {recipe.vegetarian && (
              <span className="meta-tag veg">🌱 Vegetarian</span>
            )}
          </div>
          <p className="click-hint">Click to see full recipe ▼</p>
        </div>
      </div>

      {expanded && (

        <div className="modal-overlay" onClick={handleClose}>


          <div className="modal-content" onClick={handleModalContentClick}>

           
            <button className="modal-close-btn" onClick={handleClose}>✕</button>

            
            <img
              src={recipe.image}
              alt={recipe.title}
              className="modal-image"
              onError={(e) => { e.target.src = "https://via.placeholder.com/600x300?text=No+Image"; }}
            />

            
            <div className="modal-header">
              <h2 className="modal-title">{recipe.title}</h2>
              <div className="card-meta">
                {recipe.readyInMinutes && (
                  <span className="meta-tag">⏱ {formatTime(recipe.readyInMinutes)}</span>
                )}
                {recipe.servings && (
                  <span className="meta-tag">🍽 {recipe.servings} servings</span>
                )}
                {recipe.vegetarian && (
                  <span className="meta-tag veg">🌱 Vegetarian</span>
                )}
               
              </div>
            </div>

            {/* Ingredients + Steps */}
            <div className="modal-body">
              {loadingDetails ? (
                <div className="loading-details">
                  <div className="spinner-small"></div>
                  <p>Loading recipe details...</p>
                </div>
              ) : details ? (
                <div className="modal-two-col">

                  {/* Left column: Ingredients */}
                  <div className="details-section">
                    <h3>🧂 Ingredients</h3>
                    <ul className="ingredients-list">
                      {details.extendedIngredients?.map((ing) => (
                        <li key={ing.id}>{ing.original}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Right column: Instructions */}
                  <div className="details-section">
                    <h3>📋 Instructions</h3>
                    {details.analyzedInstructions?.[0]?.steps?.length > 0 ? (
                      <ol className="steps-list">
                        {details.analyzedInstructions[0].steps.map((step) => (
                          <li key={step.number}>{step.step}</li>
                        ))}
                      </ol>
                    ) : (
                      <p className="no-instructions">
                        {details.instructions
                          ? details.instructions.replace(/<[^>]+>/g, "")
                          : "No instructions available."}
                      </p>
                    )}
                  </div>

                </div>
              ) : (
                <p>Could not load details.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

export default RecipeCard;