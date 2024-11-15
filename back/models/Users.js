module.exports = (sequelize, Sequelize) => {
  // Defining the Users model
  const Users = sequelize.define("users", {
    // ID field, auto-incremented and set as the primary key
    id: {
      type: Sequelize.INTEGER, // Integer type for the ID
      autoIncrement: true, // Auto-increments for every new user
      primaryKey: true, // Primary key for this table
    },
    // First name field with default value
    firstname: {
      type: Sequelize.STRING(50), // String type with a max length of 50 characters
      defaultValue: "Utilisateur", // Default value if the first name is not provided
    },
    // Last name field with default value
    lastname: {
      type: Sequelize.STRING(50), // String type with a max length of 50 characters
      defaultValue: "Inconnu", // Default value if the last name is not provided
    },
    // Email field which must be unique and is required
    email: {
      type: Sequelize.STRING(100), // String type with a max length of 100 characters
      allowNull: false, // The email is required (cannot be null)
      unique: true, // Ensure the email is unique
    },
    // Password field, required for user authentication
    password: {
      type: Sequelize.STRING, // String type for storing the hashed password
      allowNull: false, // The password is required
    },
    // Avatar field for profile pictures, with a default value
    avatar: {
      type: Sequelize.STRING, // String type for storing the avatar URL or path
      defaultValue: "none", // Default value if no avatar is provided
    },
    // Boolean field to track if the user account is deleted
    isDelete: {
      type: Sequelize.BOOLEAN, // Boolean type (true or false)
      defaultValue: false, // Default value is false (account is not deleted)
    },
    // Boolean field to track if the user is an admin
    // isAdmin: {
    //   type: Sequelize.BOOLEAN, // Boolean type (true or false)
    //   defaultValue: false, // Default value is false (not an admin)
    // },
  });

  return Users; // Return the defined model
};
