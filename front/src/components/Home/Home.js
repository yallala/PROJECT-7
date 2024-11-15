import React, { useState } from "react";
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Articles from "../Articles/Articles";
import Loader from "../Loader/Loader";
// For Profile
import Profile from "../Profile/Profile";
// Import styles
import "./Home.css";

const Home = ({ articles, userLogged }) => {
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [curPage, setCurPage] = useState("Home"); // Current page (Home/Profile)

  // Navigate between pages
  const navigateTo = (event) => {
    setCurPage(event.target.id); // Set the current page based on the button clicked
  };

  // Logout the user
  const logout = () => {
    if (window.confirm("You are about to log out...\nAre you sure?")) {
      sessionStorage.clear();
      App.ReloadApp(); // Reload the application after logout
    }
  };

  // Conditionally render the component based on the current page
  const renderComponent = () => {
    switch (curPage) {
      case "Home":
        return (
          <Articles
            articles={articles}
            userLogged={userLogged}
            navigateTo={navigateTo}
            logout={logout}
          />
        );
      case "Profile":
        return (
          <Profile
            userLogged={userLogged}
            navigateTo={navigateTo}
            logout={logout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <nav>
        {userLogged && (
          <Avatar
            dataUser={userLogged}
            isClickable={true}
            navigateTo={navigateTo}
            logout={logout}
          />
        )}
      </nav>

      {!isLoading && curPage ? renderComponent() : <Loader />}
    </>
  );
};

export default Home;
