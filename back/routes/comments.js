const express = require("express");
const router = express.Router(); // Create a new router instance

// Middlewares
const auth = require("../middlewares/auth"); // Authentication middleware
const multer = require("../middlewares/multer-config"); // Multer middleware for handling file uploads

// Controllers
const ctrlComment = require("../controllers/comments"); // Importing the comments controller

// Route to get comments (for example, related to an article)
router.get("/", auth, ctrlComment.commentsGet);
// Requires authentication, retrieves all comments based on certain conditions

// Route to add a new comment
router.post("/", auth, multer.single("image"), ctrlComment.commentAdd);
// Requires authentication and handles file upload (image), for adding a comment

// Route to edit a comment
router.put("/:id", auth, multer.single("image"), ctrlComment.commentEdit);
// Requires authentication and allows file upload (image), for editing a comment by ID

// Route to delete a comment
router.delete("/:id", auth, ctrlComment.commentDel);
// Requires authentication to delete a comment by ID

module.exports = router; // Export the configured router
