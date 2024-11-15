module.exports = (sequelize, Sequelize) => {
  // Defining the Jobs model
  const Jobs = sequelize.define("jobs", {
    // ID field, auto-incremented and set as the primary key
    id: {
      type: Sequelize.INTEGER, // Integer type for the ID
      autoIncrement: true, // Auto-increments for every new job entry
      primaryKey: true, // Primary key for this table
    },
    // Job title/description field
    jobs: {
      type: Sequelize.STRING(100), // String type with a maximum length of 100 characters
      allowNull: false, // The job field cannot be empty
    },
  });

  return Jobs; // Return the defined model
};
