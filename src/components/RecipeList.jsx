import RecipeCard from "./RecipeCard";
import "./RecipeList.css";

function RecipeList({ recipes, searched }) {
  // If user hasn't searched yet, show nothing
  if (!searched) return null;

  // If no recipes found
  if (recipes.length === 0) {
    return (
      <div className="no-results">
        <span>😕</span>
        <p>No recipes found. Try different ingredients!</p>
      </div>
    );
  }

  return (
    <div>
      <p className="results-count">{recipes.length} recipes found</p>
      <div className="recipe-grid">
        {/* Show each recipe as a card */}
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;
