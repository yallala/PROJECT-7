import React from "react";
// Import styles
import "./Loader.css";
// Import image
import Logo from "../../assets/logoMobile.png";

const Loader = () => {
  return (
    <div className="app-loading">
      <div className="app-loading-content">
        <img src={Logo} alt="Groupomania-Logo" />
        Loading
      </div>
    </div>
  );
};

export default Loader;
