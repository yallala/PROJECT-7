import React, { useState } from "react";
import axios from "axios";
// Import components
import Job from "./Job";
import Member from "./Member";

export default function Admin({ userLogged, jobsList }) {
  const [addJob, setAddJob] = useState(false); // Toggle for add job form
  const [valueJob, setValueJob] = useState(""); // Job input value
  const [valueSearch, setValueSearch] = useState(""); // Search input value
  const [searchResult, setSearchResult] = useState(null); // Search results
  const [validForm, setValidForm] = useState(true); // Form validation
  const [updatedJobsList, setUpdatedJobsList] = useState(jobsList); // Manage updated jobs list locally

  const userUrl = "http://localhost:3000/api/user";
  const jobUrl = "http://localhost:3000/api/jobs";

  // Toggle Add Job form visibility
  const handleToggleAddJob = () => setAddJob(!addJob);

  // Handle form input changes for job or search
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "job") setValueJob(value);
    if (name === "search") setValueSearch(value);
    validateInput(e.target); // Validate the input on change
  };

  // Validate form inputs
  const validateInput = (target) => {
    if (target.name === "job" && target.value.length >= 2) {
      target.className = "valid";
      setValidForm(false); // Enable form submission if valid
    } else if (target.name === "search" && target.value.length >= 2) {
      target.className = "valid";
      // Search for users based on input
      axios
        .get(`${userUrl}/search?search=${target.value}`)
        .then((res) => setSearchResult(res.data.users)) // Update search results
        .catch(() => {
          setSearchResult(null); // Reset search results on error
          target.className = "error"; // Mark input as invalid
        });
    } else {
      target.className = target.value.length ? "error" : "";
      setValidForm(true); // Disable form submission if invalid
    }
  };

  // Submit new job
  const handleAddJob = async (e) => {
    e.preventDefault();
    const formData = { newJob: valueJob };

    try {
      // Send a request to add a new job
      const res = await axios.post(jobUrl, formData, {
        headers: { Authorization: `Bearer ${sessionStorage.getItem("token")}` },
      });
      setUpdatedJobsList([...updatedJobsList, res.data.job]); // Update the local job list without reloading the page
      setAddJob(false); // Close the add job form after submission
    } catch (error) {
      console.error("Error adding job!", error);
    }
  };

  return (
    <div className="admin-panel">
      {userLogged ? (
        <>
          <h2>
            <i className="fa-solid fa-screwdriver-wrench"></i> Admin Panel
          </h2>

          {/* User Management */}
          <h3>
            <i className="fa-solid fa-user"></i> User Management
          </h3>
          <input
            id="Search"
            type="text"
            name="search"
            placeholder="Search for a member..."
            value={valueSearch}
            onChange={handleChange}
          />
          {valueSearch && (
            <div className="members-result">
              <h3>Found Members:</h3>
              {searchResult
                ? searchResult.map((user) => (
                  <Member
                    key={user.id}
                    userLogged={userLogged}
                    member={user}
                  />
                ))
                : "No results found!"}
            </div>
          )}

          {/* Job Management */}
          <h3>
            <i className="fa-solid fa-building"></i> Job Management
          </h3>
          <button onClick={handleToggleAddJob}>
            <i className="fa-solid fa-plus"></i>
          </button>
          {addJob && (
            <form onSubmit={handleAddJob}>
              <input
                id="Job"
                name="job"
                type="text"
                placeholder="Enter job name"
                value={valueJob}
                onChange={handleChange}
              />
              <button type="submit" disabled={validForm}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </form>
          )}

          {/* Display Jobs */}
          {updatedJobsList && updatedJobsList.length > 0
            ? updatedJobsList.map((job, index) => (
              <Job key={index} userLogged={userLogged} job={job} />
            ))
            : "No jobs found!"}
        </>
      ) : (
        "Error loading Admin Panel!"
      )}
    </div>
  );
}
