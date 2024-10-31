const jwt = require("jsonwebtoken"); // Importing the JSON Web Token module

module.exports = (req, res, next) => {
  try {
    console.log("--- Enter middleware auth ---");

    // Check if the authorization header is present
    if (!req.headers.authorization) {
      throw "Missing token!"; // Throw an error if token is missing
    }

    // Extracting the token from the Authorization header
    const token = req.headers.authorization.split(" ")[1].split('"')[1];

    // Verifying the token using the secret key
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");

    // Extracting the userId from the decoded token
    const userId = decodedToken.userId;

    // Check if the provided userId matches the one in the token
    if (req.body.userId && req.body.userId !== userId) {
      throw "Invalid User ID!"; // Throw an error if the userId doesn't match
    } else {
      console.log("--- Exit middleware auth ---");
      next(); // Proceed to the next middleware or route handler
    }
  } catch {
    // If an error occurs, return a 401 Unauthorized response
    res.status(401).json({ error: "Unauthenticated request!" });
  }
};
