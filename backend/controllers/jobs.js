const db = require("../models"); // Importing the database models
const Jobs = db.jobs; // Importing the Jobs model

// Fetching all jobs.
exports.jobsGet = (req, res) => {
  Jobs.findAll()
    .then((jobs) => {
      // Check if any jobs exist in the database
      if (!jobs) return res.status(204).json({ error: "No Jobs Found!" }); // Return 204 if no jobs found

      res.status(200).json({ jobs }); // Return the jobs if found
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle any errors during the query
    });
};

// Adding a new job.
exports.jobAdd = (req, res) => {
  console.log(req.body); // Log the request body for debugging
  // Check if the job input is provided
  if (!req.body.newJob) return res.status(400).json({ error: "Empty input!" }); // Return 400 if no input is provided

  // Create a new job in the database
  Jobs.create({ jobs: req.body.newJob }).then((job) => {
    res.status(201).json({ job: job }); // Return the newly created job
  });
};

// Editing an existing job.
exports.jobEdit = (req, res) => {
  const jobId = req.params.id; // Get the job ID from URL parameters
  const valueJob = req.body.job; // Get the updated job value from the request body

  // Check if the updated job value is provided
  if (!valueJob) return res.status(400).json({ error: "no value!" });

  // Find the job by its ID
  Jobs.findOne({ where: { id: jobId } })
    .then((job) => {
      // Update the job in the database
      Jobs.update({ jobs: valueJob }, { where: { id: job.id } })
        .then(() => res.status(200).json({ message: "Job updated!" })) // Return success response
        .catch(() => res.status(304).json({ message: "Job not updated!" })); // Return 304 if the update fails
    })
    .catch(() => console.error("Impossible de trouver cet emploi!")); // Log an error if the job cannot be found
};

// Deleting a job.
exports.jobDel = (req, res) => {
  const jobId = req.params.id; // Get the job ID from URL parameters

  // Find the job by its ID
  Jobs.findOne({ where: { id: jobId } })
    .then((job) => {
      // Delete the job from the database
      Jobs.destroy({ where: { id: job.id } })
        .then(() => res.status(200).json({ message: "Job deleted!" })) // Return success response
        .catch(() => res.status(304).json({ message: "Job not deleted!" })); // Return 304 if the deletion fails
    })
    .catch(() => console.error("Impossible de trouver cet emploi!")); // Log an error if the job cannot be found
};
