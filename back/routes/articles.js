const express = require("express");
const router = express.Router(); // Create a new router instance

// Middlewares
const auth = require("../middlewares/auth"); // Authentication middleware
const multer = require("../middlewares/multer-config"); // Multer middleware for handling file uploads

// Controllers
const ctrlArticle = require("../controllers/articles"); // Importing the articles controller

// Route to get all articles
router.get("/", ctrlArticle.articlesGet); // No authentication or file upload needed

// Route to add a new article
router.post("/", auth, multer.single("image"), ctrlArticle.articleAdd);
// Requires authentication and handles file upload (image)

// Route to edit an article
router.put("/:id", auth, multer.single("image"), ctrlArticle.articleEdit);
// Requires authentication and allows file upload (image) for editing

// Route to delete an article, including optionally deleting an image
router.delete("/:id/:image", auth, ctrlArticle.articleDel);
// Requires authentication, handles both article and image deletion

module.exports = router; // Export the configured router
