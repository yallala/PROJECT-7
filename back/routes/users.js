const express = require("express");
const router = express.Router(); // Create a new Express router

// Middlewares
const auth = require("../middlewares/auth"); // Authentication middleware
const multer = require("../middlewares/multer-config"); // Multer middleware for file uploads (e.g., avatar)

// Controllers
const ctrlUser = require("../controllers/users"); // Import the user controller

// Route for user login
router.post("/login", ctrlUser.userLogin);
// Handles user login. No authentication needed since it's a login route

// Route for user registration (sign-up)
router.post("/signup", multer.single("avatar"), ctrlUser.userSignup);
// Allows new users to sign up and optionally upload an avatar

// Route to retrieve a user's information
router.get("/", ctrlUser.userGet);
// Retrieves user information, typically based on query parameters (e.g., userId)

// Route to search for users
router.get("/search", ctrlUser.userSearch);
// Allows for searching users, possibly by firstname or lastname

// Route to edit user profile or account status
router.put("/:id/:delete", auth, multer.single("avatar"), ctrlUser.userEdit);
// Requires authentication. Allows a user to edit their profile or delete their account (depending on the `:delete` parameter). Supports avatar update via file upload

// Route to delete a user or their avatar
router.delete("/:id/:avatar", auth, ctrlUser.userDel);
// Requires authentication. Deletes a user profile or their avatar based on the `:avatar` parameter

module.exports = router; // Export the router
