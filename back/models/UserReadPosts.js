// models/UserReadPosts.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const UserReadPosts = sequelize.define("UserReadPosts", {
    userId: { type: DataTypes.INTEGER, allowNull: false },
    postId: { type: DataTypes.INTEGER, allowNull: false },
  });

  // Define associations
  UserReadPosts.associate = (models) => {
    UserReadPosts.belongsTo(models.users, { foreignKey: "userId", as: "user" });
    UserReadPosts.belongsTo(models.articles, { foreignKey: "postId", as: "post" });
  };

  return UserReadPosts;
};
