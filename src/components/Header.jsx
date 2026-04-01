import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-icon">🍳</div>
      <h1 className="header-title">Recipe Finder</h1>
      <p className="header-subtitle">
        Enter ingredients you have and discover delicious recipes
      </p>
    </header>
  );
}

export default Header;
