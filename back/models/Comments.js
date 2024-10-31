module.exports = (sequelize, Sequelize) => {
  // Defining the Comments model
  const Comments = sequelize.define("comments", {
    // ID field, auto-incremented and set as the primary key
    id: {
      type: Sequelize.INTEGER, // Integer type for the ID
      autoIncrement: true, // Auto-increments for every new comment
      primaryKey: true, // Primary key for this table
    },
    // Comment content field
    comment: {
      type: Sequelize.STRING, // String type for storing the comment text
      allowNull: false, // The comment field cannot be empty
    },
    // Image field for optional images attached to the comment
    image: {
      type: Sequelize.STRING, // String type to store the image URL or path
      defaultValue: "none", // Default value set to "none" if no image is provided
    },
    // Post date field to store when the comment was posted
    postDate: {
      type: Sequelize.DATE, // Date type to store the post date
      defaultValue: Sequelize.NOW, // Default to the current timestamp if not provided
    },
  });

  return Comments; // Return the defined model
};
