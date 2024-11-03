import React, { useState } from "react";
import axios from "axios";

const Job = ({ userLogged, job }) => {
  const [editJob, setEditJob] = useState(false); // Toggle to show/hide edit form
  const [isEdited, setIsEdited] = useState(false); // Tracks if a job has been edited
  const [valueJob, setValueJob] = useState(job.jobs); // Job name input value

  const jobUrl = "http://localhost:3000/api/jobs"; // API endpoint for jobs

  // Toggle Edit Job form and handle job updates
  const handleClickEditJob = async (jobId) => {
    if (editJob && isEdited) {
      // If edit mode is active and job was modified, submit the updated job
      const formData = { job: valueJob };
      try {
        await axios.put(`${jobUrl}/${jobId}`, formData, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        setEditJob(false); // Close edit mode
        document.location.reload(); // Reload page after editing (can be improved with state management)
      } catch (error) {
        console.error("Error updating the job!", error);
      }
    } else {
      setEditJob(!editJob); // Toggle edit mode
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (window.confirm(`Are you sure you want to delete job ID: ${jobId}?`)) {
      try {
        await axios.delete(`${jobUrl}/${jobId}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        document.location.reload(); // Reload page after deletion (can be improved with state management)
      } catch (error) {
        console.error("Error deleting the job!", error);
      }
    }
  };

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "job") {
      setIsEdited(job.jobs !== value); // Mark as edited if the value differs
      setValueJob(value); // Update job input value
      validateInput(event.target); // Validate the input
    }
  };

  // Validate form inputs
  const validateInput = (target) => {
    if (target.name === "job") {
      target.className = target.value.length >= 2 ? "valid" : "error"; // Toggle CSS class based on validity
    }
  };

  return (
    <>
      {userLogged && job ? (
        <div className="job" key={`Jobs-${job.id}`}>
          {editJob ? (
            <>
              {/* Edit Job Form */}
              <label htmlFor="Job">Job</label>
              <input
                id="Job"
                name="job"
                type="text"
                placeholder="Enter job name"
                defaultValue={valueJob}
                onChange={handleChange}
              />
              <div>
                <button
                  className="edit actived"
                  aria-label="editJob"
                  onClick={() => handleClickEditJob(job.id)}
                >
                  <i className="fa-solid fa-pen"></i>
                </button>
                {job.id !== 1 && (
                  <button
                    className="delete"
                    aria-label="delJob"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Job Display */}
              <p>{job.jobs}</p>
              <div>
                <button
                  className="edit"
                  aria-label="editJob"
                  onClick={() => setEditJob(!editJob)}
                >
                  <span className="hidden">edit job</span>
                  <i className="fa-solid fa-pen"></i>
                </button>
                {job.id !== 1 && (
                  <button
                    className="delete"
                    aria-label="delJob"
                    onClick={() => handleDeleteJob(job.id)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        "Error loading jobs!"
      )}
    </>
  );
};

export default Job;
