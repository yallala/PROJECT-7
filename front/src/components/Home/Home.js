import React, { useState, useEffect } from "react";
import axios from "axios";
// Import components
import App from "../App";
import Avatar from "../Avatar/Avatar";
import Articles from "../Articles/Articles";
import Loader from "../Loader/Loader";
// For Profile
import Profile from "../Profile/Profile";
// For Admin
import Admin from "../Admin/Admin";
// Import styles
import "./Home.css";

const Home = ({ articles, userLogged }) => {
  const [jobsList, setJobsList] = useState(null); // Jobs list data
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [curPage, setCurPage] = useState("Home"); // Current page (Home/Profile/Admin)

  const jobUrl = "http://localhost:3000/api/jobs"; // API URL for jobs

  // Fetch jobs data on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(jobUrl);
        setJobsList(res.data.jobs);
      } catch (error) {
        console.error("Error fetching jobs", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); // Empty dependency array means this will run once on mount

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
            jobsList={jobsList}
            navigateTo={navigateTo}
            logout={logout}
          />
        );
      case "Admin":
        return (
          <Admin
            userLogged={userLogged}
            jobsList={jobsList}
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
