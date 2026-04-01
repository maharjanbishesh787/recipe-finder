import { useState } from "react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/RecipeList";
import { searchRecipes } from "./services/api";
import "./App.css";``

function App() {
  // Store the list of recipes fetched from API
  const [recipes, setRecipes] = useState([]);

  // Track loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Store the search that was made (to show in UI)
  const [searched, setSearched] = useState(false);

  // This function runs when user clicks Search
  async function handleSearch(ingredients) {
    setLoading(true);
    setError("");
    setSearched(true);
    setRecipes([]);

    const result = await searchRecipes(ingredients);

    if (result.error) {
      setError(result.error);
    } else {
      setRecipes(result);
    }

    setLoading(false);
  }

  return (
    <div className="app">
      <Header />
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Finding recipes...</p>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
      {!loading && <RecipeList recipes={recipes} searched={searched} />}
    </div>
  );
}

export default App;
