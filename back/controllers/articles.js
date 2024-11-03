const fs = require("fs"); // Importing file system module to work with files
const db = require("../models"); // Importing the database models
const Users = db.users; // Importing the Users model
const Jobs = db.jobs; // Importing the Jobs model
const Articles = db.articles; // Importing the Articles model

// Fetching all articles.
exports.articlesGet = (req, res) => {
  Articles.findAll({
    include: [
      { model: Users, include: { model: Jobs } },
    ],
    order: [["id", "DESC"]], // Sorting by article ID in descending order (latest articles first)
  })
    .then((articles) => {
      // Checking if there are any articles in the database
      if (articles.length <= 0)
        return res.status(204).json({ error: "No Articles!" }); // Return 204 if no articles found

      return res.status(200).json({ articles: articles }); // Return articles if found
    })
    .catch((error) => {
      // Handle any error that occurs during the database query
      return res.status(500).json({ error: error });
    });
};

// Adding a new article.
exports.articleAdd = (req, res) => {
  let authorId = req.body.userId; // Getting the ID of the user who authored the article
  let myArticle = req.body.article; // Getting the article content
  let myImage = "none"; // Default value for the image, if none is uploaded

  // Check if article content or image is provided in the request
  if (!req.body.article && !req.file)
    return res.status(400).json({ error: "Empty input!" }); // Return 400 if no input is provided

  // If a file is uploaded, construct the image URL
  if (req.file && req.file.filename)
    myImage = `${req.protocol}://${req.get("host")}/images/${req.file.filename
      }`;

  // Find the user by ID who authored the article
  Users.findOne({ where: { id: authorId } })
    .then((author) => {
      // Create a new article record in the database
      Articles.create({
        article: myArticle, // Article content
        image: myImage, // Image URL
        postDate: new Date(), // Current date as the post date
        authorId: author.id, // Author's user ID
      });
      return res.status(201).json({ message: "Article created!" }); // Return success response
    })
    .catch((error) => {
      // Handle any error that occurs during user lookup or article creation
      console.log("Error!");
      console.log(error);
      return res.status(500).json({ error: error });
    });
};

// Editing an article.
exports.articleEdit = (req, res) => {
  // Get the ID of the article to be modified
  let articleId = req.params.id;
  let myArticle = req.body.message; // Get the updated article content
  let myImage = "none"; // Default value for the image

  // Find the article by its ID
  Articles.findOne({ where: { id: articleId } })
    .then((article) => {
      // If the user uploaded a new image
      if (req.file && req.file.filename) {
        myImage = `${req.protocol}://${req.get("host")}/images/${req.file.filename
          }`;
        // If the article already had an image, delete the old one
        if (myImage != "none" && article.image != "none") {
          const filename = article.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => { });
        }
      } else {
        myImage = article.image; // Retain the old image if no new one is uploaded
      }

      // Update the article content and/or image
      article
        .update({
          article: myArticle, // Updated article content
          image: myImage, // Updated image
        })
        .then((result) => {
          console.log(result);
          res.status(201).json({ message: "Article updated!" }); // Return success response
        })
        .catch((error) => {
          console.log(error);
          res.status(500).json({ message: error }); // Handle errors during update
        });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error }); // Handle errors during article lookup
    });
};

// Deleting an article.
exports.articleDel = (req, res) => {
  // Get the ID of the article to be deleted
  let articleId = req.params.id;
  let isImage = false; // Flag to check if only the image is being deleted

  if (req.params.image == 1) isImage = true; // Check if only the image should be deleted

  // Find the article by its ID
  Articles.findOne({ where: { id: articleId } })
    .then((article) => {
      // If the user wants to delete the image only
      if (isImage) {
        // If the article has an image, delete it
        if (article.image != "none") {
          const filename = article.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => { });
        }
        // Update the article to remove the image reference
        Articles.update({ image: "none" }, { where: { id: articleId } })
          .then(() => {
            return res.status(200).json({ message: "Image deleted!" }); // Return success response
          })
          .catch(() => {
            return res.status(304); // Return "Not Modified" status
          });
      }
      // If the user wants to delete the entire article
      else {
        // If the article has an image, delete the image file
        if (article.image != "none") {
          const filename = article.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => { });
        }
        // Delete the article from the database
        Articles.destroy({ where: { id: articleId } })
          .then(() => res.status(200).json({ message: "Article deleted!" })) // Return success response
          .catch((error) => res.status(400).json({ error })); // Handle errors during deletion
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error }); // Handle errors during article lookup
    });
};
