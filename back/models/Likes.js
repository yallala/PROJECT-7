// module.exports = (sequelize, Sequelize) => {
//   // Defining the Likes model
//   const Likes = sequelize.define("likes", {
//     // ID field, auto-incremented and set as the primary key
//     id: {
//       type: Sequelize.INTEGER, // Integer type for the ID
//       autoIncrement: true, // Auto-increments for every new like entry
//       primaryKey: true, // Primary key for this table
//     },
//     // User ID field
//     userId: {
//       type: Sequelize.INTEGER, // Integer type for storing the ID of the user who liked an article
//       allowNull: false, // The userId field is required (cannot be null)
//     },
//     // Article ID field
//     articleId: {
//       type: Sequelize.INTEGER, // Integer type for storing the ID of the article that was liked
//       allowNull: false, // The articleId field is required (cannot be null)
//     },
//   });

//   return Likes; // Return the defined model
// };
