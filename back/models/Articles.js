module.exports = (sequelize, Sequelize) => {
  // Defining the Articles model
  const Articles = sequelize.define("articles", {
    // ID field, auto-incremented and set as the primary key
    id: {
      type: Sequelize.INTEGER, // Integer type for the ID
      autoIncrement: true, // Auto-increments for every new article
      primaryKey: true, // Primary key for this table
    },
    // Article content field
    article: {
      type: Sequelize.STRING, // String type for storing article text
      allowNull: false, // The article field cannot be empty
    },
    // Image field for storing the article's associated image
    image: {
      type: Sequelize.STRING, // String type to store the image URL or path
      defaultValue: "none", // Default value set to "none" if no image is provided
    },
    // Post date field for when the article was posted
    postDate: {
      type: Sequelize.DATE, // Date type to store the post date
      allowNull: false, // Post date must always be provided
    },
  });

  return Articles; // Return the defined model
};
