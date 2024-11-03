import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Import the main App component
import App from "./components/App";
// Import global styles
import "./index.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

// Main Application rendering with routes
root.render(
  // Using BrowserRouter for handling navigation in React
  <BrowserRouter>
    <Routes>
      {/* Default route that renders the App component */}
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
);
