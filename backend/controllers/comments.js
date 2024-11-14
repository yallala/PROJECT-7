const db = require("../models"); // Importing the database models
const Users = db.users; // Importing the Users model
const Comments = db.comments; // Importing the Comments model
const Jobs = db.jobs; // Importing the Jobs model

// Fetching comments for a specific article.
exports.commentsGet = (req, res) => {
  const articleId = req.query.article; // Get the article ID from query parameters
  Comments.findAll({
    where: { articleId: articleId }, // Filter comments by article ID
    include: [{ model: Users, include: { model: Jobs } }], // Include the associated Users (with Jobs model)
    order: [["id", "DESC"]], // Sort comments by ID in descending order (latest comments first)
  })
    .then((comments) => {
      // Check if there are any comments in the database
      if (comments.length <= 0)
        return res.status(204).json({ error: "No Comments!" }); // Return 204 if no comments are found

      res.status(200).json({ comments: comments }); // Return the comments if found
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle any errors during the query
    });
};

// Adding a new comment.
exports.commentAdd = (req, res) => {
  const authorId = req.body.userId; // Get the user ID of the comment author
  const articleId = req.body.articleId; // Get the article ID to which the comment belongs
  const myComment = req.body.comment; // Get the comment content
  let myImage = "none"; // Default value for the image, if none is uploaded

  // Check if comment content or an image is provided
  if (!req.body.comment && !req.file)
    return res.status(400).json({ error: "Empty input!" }); // Return 400 if no input is provided

  // If a file is uploaded, construct the image URL
  if (req.file)
    myImage = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

  // Find the user who is the author of the comment
  Users.findOne({ where: { id: authorId } })
    .then((author) => {
      // Create a new comment in the database
      Comments.create({
        comment: myComment, // Comment content
        postDate: new Date(), // Current date as the comment's post date
        image: myImage, // Image URL if provided
        authorId: author.id, // Author's user ID
        articleId: articleId, // Article ID to which the comment is linked
      });
      return res.status(201).json({ message: "Comment created!" }); // Return success response
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle any errors during user lookup or comment creation
    });
};

// Editing a comment.
exports.commentEdit = (req, res) => {
  // Get the ID of the comment to be edited
  const commentId = req.params.id;
  let myComment = req.body.comment; // Get the updated comment content
  let myImage = "none"; // Default value for the image

  // If a new image file is uploaded, construct the new image URL
  if (req.file && req.file.filename)
    myImage = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

  // Find the comment by its ID
  Comments.findOne({ where: { id: commentId } })
    .then((comment) => {
      // If there was a previous image and a new image is uploaded, delete the old image
      if (myImage != "none" && comment.image != "none") {
        const filename = comment.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {}); // Delete the old image file
      }

      // Update the comment content and/or image
      comment
        .update({
          comment: myComment, // Updated comment content
          image: myImage, // Updated image URL
        })
        .then(() => res.status(201).json({ message: "Comment updated!" })) // Return success response
        .catch((error) => res.status(500).json({ message: error })); // Handle errors during update
    })
    .catch((error) => res.status(500).json({ message: error })); // Handle errors during comment lookup
};

// Deleting a comment.
exports.commentDel = (req, res) => {
  // Get the ID of the comment to be deleted
  const commentId = req.params.id;

  // Find the comment by its ID
  Comments.findOne({ where: { id: commentId } })
    .then((comment) => {
      // If the comment has an image, delete the image file
      if (comment.image != "none") {
        const filename = comment.image.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {}); // Delete the image
      }

      // Delete the comment from the database
      Comments.destroy({ where: { id: commentId } })
        .then(() => res.status(200).json({ message: "Comment deleted!" })) // Return success response
        .catch((error) => res.status(400).json({ error })); // Handle errors during deletion
    })
    .catch((error) => res.status(500).json({ message: error })); // Handle errors during comment lookup
};
