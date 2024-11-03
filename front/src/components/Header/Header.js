import React from "react";
import { Link } from "react-router-dom";
// Import components
import App from "../App";
// Import styles
import "./Header.css";

const Header = () => {
  return (
    <header>
      <Link onClick={App.ReloadApp} to="./">
        <div className="logo">
          <span className="hidden">home</span>
        </div>
      </Link>
      <h1>Groupomania</h1>
    </header>
  );
};

export default Header;
