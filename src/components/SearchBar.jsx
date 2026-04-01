import { useState } from "react";
import "./SearchBar.css";

const SUGGESTIONS = [
  { name: "chicken",  emoji: "🍗" },
  { name: "tomato",   emoji: "🍅" },
  { name: "onion",    emoji: "🧅" },
  { name: "garlic",   emoji: "🧄" },
  { name: "potato",   emoji: "🥔" },
  { name: "egg",      emoji: "🥚" },
  { name: "cheese",   emoji: "🧀" },
  { name: "pasta",    emoji: "🍝" },
  { name: "rice",     emoji: "🍚" },
  { name: "beef",     emoji: "🥩" },
  { name: "carrot",   emoji: "🥕" },
  { name: "spinach",  emoji: "🥬" },
  { name: "mushroom", emoji: "🍄" },
  { name: "lemon",    emoji: "🍋" },
  { name: "butter",   emoji: "🧈" },
  { name: "milk",     emoji: "🥛" },
  { name: "flour",    emoji: "🌾" },
  { name: "pepper",   emoji: "🌶️" },
];

function SearchBar({ onSearch }) {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  function handleInputChange(e) {
    const value = e.target.value;
    setInputValue(value);
    if (value.trim().length > 0) {
      const filtered = SUGGESTIONS.filter(
        (s) =>
          s.name.toLowerCase().includes(value.toLowerCase()) &&
          !tags.includes(s.name) 
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    }
  }

  function addTag(value) {
    const cleaned = value.trim().replace(",", "");
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
    }
    setInputValue("");
    setSuggestions([]);
  }

  function removeTag(tagToRemove) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  function handleSuggestionClick(suggestion) {
    addTag(suggestion.name); 
  }

  function handleSearch() {
    if (tags.length === 0 && inputValue.trim()) {
      addTag(inputValue);
      return;
    }
    if (tags.length > 0) {
      onSearch(tags);
    }
  }


  return (
    <div className="searchbar-wrapper">

      <div className="input-area">

        
        {tags.map((tag) => (
          <span key={tag} className="tag">
            {getEmojiForTag(tag)} {tag}
            <button onClick={() => removeTag(tag)} className="tag-remove">×</button>
          </span>
        ))}

        <input
          type="text"
          className="ingredient-input"
          placeholder={tags.length === 0 ? "Type an ingredient and press Enter..." : "Add more..."}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((s) => (
            <li key={s.name} onClick={() => handleSuggestionClick(s)} className="suggestion-item">
              {s.emoji} {s.name} 
            </li>
          ))}
        </ul>
      )}

      <button
        className="search-btn"
        onClick={handleSearch}
        disabled={tags.length === 0 && !inputValue.trim()}
      >
        🔍 Find Recipes
      </button>
    </div>
  );
}

export default SearchBar;