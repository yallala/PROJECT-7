require("dotenv").config(); // Load environment variables from .env file
const { Sequelize } = require('sequelize');


// Create a new Sequelize instance with database connection configuration from environment variables
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST, // Database host
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIAL, // Database dialect (e.g., 'mysql', 'postgres')
    logging: false, // Disable logging of SQL queries
    define: {
      timestamps: false, // Disable automatic timestamps (createdAt, updatedAt) for all models
    },
  }
);

// Initialize an empty object to hold models and Sequelize instance
const db = {};
db.Sequelize = Sequelize; // Sequelize library
db.sequelize = sequelize; // Sequelize instance (the connection to the database)

// Importing all models and associating them with the Sequelize instance
db.users = require("./Users")(sequelize, Sequelize);
db.articles = require("./Articles")(sequelize, Sequelize);
db.comments = require("./Comments")(sequelize, Sequelize);
db.jobs = require("./Jobs")(sequelize, Sequelize);
db.likes = require("./Likes")(sequelize, Sequelize);

// Defining foreign key objects
const keyAuthor = { name: "authorId", allowNull: false }; // Foreign key for authors
const keyArticle = { name: "articleId", allowNull: false }; // Foreign key for articles
const keyJob = { name: "jobId", allowNull: false }; // Foreign key for jobs

// Associations between models

// Jobs and Users
db.jobs.hasOne(db.users, { foreignKey: keyJob }); // A job can be associated with one user
db.users.belongsTo(db.jobs, { foreignKey: keyJob }); // A user belongs to a job

// Users and Articles (author relationship)
db.users.hasMany(db.articles, { foreignKey: keyAuthor }); // A user can author multiple articles
db.articles.belongsTo(db.users, { foreignKey: keyAuthor }); // An article belongs to a user

// Users and Comments (author relationship)
db.users.hasMany(db.comments, { foreignKey: keyAuthor }); // A user can author multiple comments
db.comments.belongsTo(db.users, { foreignKey: keyAuthor }); // A comment belongs to a user

// Articles and Comments
db.articles.hasMany(db.comments, { foreignKey: keyArticle }); // An article can have multiple comments
db.comments.belongsTo(db.articles, { foreignKey: keyArticle }); // A comment belongs to an article

// Articles and Likes
db.articles.hasMany(db.likes, { foreignKey: keyArticle }); // An article can have multiple likes
db.likes.belongsTo(db.articles, {
  foreignKey: keyArticle,
  onDelete: "CASCADE",
}); // A like belongs to an article, cascade delete if article is deleted

module.exports = db; // Exporting the db object containing all models and associations

