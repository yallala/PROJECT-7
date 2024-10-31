const db = require("../models"); // Importing the database models
const { Op } = require("sequelize"); // Sequelize operators for query conditions
const Likes = db.likes; // Importing the Likes model

// Add or remove a like.
exports.like = (req, res) => {
  const userId = req.body.userId; // Extracting user ID from request body
  const articleId = req.body.articleId; // Extracting article ID from request body

  // Check if the user has already liked the article
  Likes.findAll({
    where: {
      [Op.and]: [
        { userId: userId }, // Condition: user ID matches
        { articleId: articleId }, // Condition: article ID matches
      ],
    },
  })
    .then((likes) => {
      // If no like found, add a like
      if (!likes || likes.length == 0) {
        Likes.create({ ...req.body }) // Create a new like record
          .then((like) => {
            return res.status(201).json(like); // Return the created like
          })
          .catch((err) => {
            return res.status(500).json({ error: err }); // Return error if failed to create
          });
      }
      // If the user has already liked the article, remove the like
      else {
        Likes.destroy({
          where: {
            [Op.and]: [
              { userId: userId }, // Condition: user ID matches
              { articleId: articleId }, // Condition: article ID matches
            ],
          },
        });
        return res.status(200).json("Like removed!"); // Return success message
      }
    })
    .catch((err) => res.status(500).json(err)); // Handle any errors during the query
};
