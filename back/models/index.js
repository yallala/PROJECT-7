require("dotenv").config(); // Load environment variables from .env file
const { Sequelize } = require("sequelize");

// Initialize Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIAL, // e.g., "mysql" or "postgres"
    logging: false, // Disable logging
    define: {
      timestamps: false, // Disable automatic timestamps for all models
    },
  }
);

// Initialize the db object
const db = {
  Sequelize: Sequelize, // Sequelize library
  sequelize: sequelize, // Sequelize instance
};

// Import models and pass the Sequelize instance
db.users = require("./Users")(sequelize, Sequelize);
db.articles = require("./Articles")(sequelize, Sequelize);
db.jobs = require("./Jobs")(sequelize, Sequelize);
db.UserReadPosts = require("./UserReadPosts")(sequelize, Sequelize); // Add your UserReadPosts model

// Define associations
db.jobs.hasOne(db.users, { foreignKey: { name: "jobId", allowNull: false } });
db.users.belongsTo(db.jobs, { foreignKey: { name: "jobId", allowNull: false } });

db.users.hasMany(db.articles, { foreignKey: { name: "authorId", allowNull: false } });
db.articles.belongsTo(db.users, { foreignKey: { name: "authorId", allowNull: false } });

db.UserReadPosts.belongsTo(db.users, { foreignKey: "userId", as: "user" });
db.UserReadPosts.belongsTo(db.articles, { foreignKey: "postId", as: "post" });

module.exports = db; // Export the db object
