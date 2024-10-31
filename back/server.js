require("dotenv").config(); // Load environment variables from the .env file
const http = require("http"); // Import the http module to create the server
const app = require("./app"); // Import the Express application
// SQL Database connection
const db = require("./models"); // Import the Sequelize models (and the database connection)

// Define the port using environment variables, with a fallback option
const PORT = process.env.PORT || 3000;

app.set("port", PORT); // Set the port for the Express app
const server = http.createServer(app); // Create the server using the Express app

// Server error handling
server.on("error", (err) => {
  console.log(`Server Error | ${err}`); // Log any server errors
});

// Start the server and handle database connection
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`); // Log that the server is running
  console.log("Checking database connection..."); // Inform that the database connection is being checked

  // Test the database connection using Sequelize's authenticate method
  db.sequelize
    .authenticate()
    .then(() => {
      // Synchronize the models with the database without altering or forcing changes
      db.sequelize.sync({ alter: false, force: false });
      console.log("Database connection OK!"); // Log success
      console.log("-----------------------");
    })
    .catch((error) => {
      // Log if there is a failure in connecting to the database
      console.log("Unable to connect to the database:");
      console.log(error.message); // Log the specific error message
      console.log("-----------------------");
      process.exit(1); // Exit the process if unable to connect to the database
    });
});


