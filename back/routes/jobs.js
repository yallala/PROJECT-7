const express = require("express");
const router = express.Router(); // Create a new router instance

// Middlewares
const auth = require("../middlewares/auth"); // Authentication middleware

// Controllers
const ctrlJob = require("../controllers/jobs"); // Importing the jobs controller

// Route to get all jobs
router.get("/", ctrlJob.jobsGet);
// No authentication needed, retrieves all job entries

// Route to add a new job
router.post("/", auth, ctrlJob.jobAdd);
// Requires authentication, allows authenticated users to add a job

// Route to edit an existing job
router.put("/:id", auth, ctrlJob.jobEdit);
// Requires authentication, allows editing a job by its ID

// Route to delete a job
router.delete("/:id", auth, ctrlJob.jobDel);
// Requires authentication, allows deleting a job by its ID

module.exports = router; // Export the configured router
