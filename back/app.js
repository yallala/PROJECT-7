const express = require("express");
const app = express(); // Initialize the Express app
const path = require("path"); // Path module to handle file paths

// Import routes for different resources
const userRoutes = require("./routes/users");
const articlesRoutes = require("./routes/articles");
const jobsRoutes = require("./routes/jobs");

// CORS (Cross-Origin Resource Sharing) configuration
app.use((req, res, next) => {
  // Allow requests from any origin
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Allow specific headers in requests
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next(); // Pass control to the next middleware function
});

// Middleware to parse incoming requests with URL-encoded and JSON payloads
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Use the imported routes and define their base paths
app.use("/api/auth", userRoutes); // Authentication routes (login, signup)
app.use("/api/user", userRoutes); // User-related routes
app.use("/api/articles", articlesRoutes); // Article-related routes
app.use("/api/jobs", jobsRoutes); // Job-related routes

// Serve static files for images and avatars
app.use("/images", express.static(path.join(__dirname, "images"))); // Serve images
app.use("/avatars", express.static(path.join(__dirname, "avatars"))); // Serve avatars

module.exports = app; // Export the Express app



// const express = require("express");
// // const mongoose = require("mongoose");
// const path = require("path");

// const app = express();
// const url = process.env.DB_URL;
// // const userRoutes = require("./routes/user");
// // const sauceRoutes = require("./routes/sauce");


// app.use(express.json());

// // mongoose.connect(url)
// //   .then(() => {
// //     console.log('Successfully connected to MongoDB Atlas!');
// //   })
// //   .catch((error) => {
// //     console.log('Unable to connect to MongoDB Atlas!');
// //     console.error(error);
// //   });

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });


// // app.use("/images", express.static(path.join(__dirname, "images")));
// // app.use("/api/auth", userRoutes);
// // app.use("/api/sauces", sauceRoutes);

// module.exports = app;