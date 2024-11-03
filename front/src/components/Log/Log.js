import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
// Import styles
import "./Log.css";

const Log = () => {
  const [curPage, setCurPage] = useState("Login");

  // Navigate between Login and Register
  const navigateTo = (event) => {
    setCurPage(event.target.value);
  };

  return (
    <>
      {curPage === "Login" ? (
        <Login navigateTo={navigateTo} />
      ) : (
        <Register navigateTo={navigateTo} />
      )}
    </>
  );
};

export default Log;
