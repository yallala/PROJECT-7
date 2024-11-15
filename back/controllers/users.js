const fs = require("fs"); // File system module for working with file operations
const bCrypt = require("bcrypt"); // bcrypt module for password hashing
const jwt = require("jsonwebtoken"); // JSON Web Token for user authentication
const db = require("../models"); // Importing the database models
const { Op } = require("sequelize"); // Sequelize operators for complex queries
const Users = db.users; // Importing the Users model
const Jobs = db.jobs; // Importing the Jobs model

// Fetching user information.
exports.userGet = (req, res) => {
  let authorId = parseInt(req.query.id); // Parsing the user ID from the request
  Users.findOne({
    where: { id: authorId, isDelete: false }, // Ensuring the user is not deleted
    include: { model: Jobs }, // Including the user's job information
  })
    .then((user) => {
      // Check if the user exists in the database
      if (!user) return res.status(404).json({ error: "User not found!" }); // Return 404 if user not found

      res.status(200).json({ user }); // Return user information if found
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle any errors during the query
    });
};

// Searching user by first name.
exports.userSearch = (req, res) => {
  let search = req.query.search; // Getting the search query from request
  Users.findAll({
    where: {
      firstname: {
        [Op.like]: "%" + search + "%", // Search for users with a similar first name
      },
    },
    include: { model: Jobs }, // Include the user's job information
  })
    .then((users) => {
      if (!users.length) return res.status(204).json({ message: "Empty!" }); // Return 204 if no users found
      res.status(200).json({ users }); // Return the found users
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle any errors during the query
    });
};

// User login.
exports.userLogin = (req, res) => {
  // Check if email and password are provided in the request body
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ error: "Empty input!" });

  // Find the user by email
  Users.findOne({ where: { email: req.body.email, isDelete: false } })
    .then((user) => {
      // Check if the email exists in the database
      if (!user) return res.status(404).json({ error: "User not found!" });

      // Compare the entered password with the hashed password
      bCrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid)
            return res.status(401).json({ error: "Incorrect password!" });

          // Return the user ID and a JSON Web Token valid for 24 hours
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id },
              "RANDOM_TOKEN_SECRET", // Secret key for signing the token
              { expiresIn: "24h" } // Token expires in 24 hours
            ),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => {
      return res.status(500).json({ error: error }); // Handle errors during user lookup
    });
};

// User registration.
exports.userSign = (req, res) => {
  // Check if email and password are provided in the request body
  if (!req.body.email || !req.body.password)
    return res.status(400).json({ error: "Empty input!" });

  // Hash the user's password
  bCrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      console.log("New registration.");
      let objectJobs = { jobs: "" }; // Default job for new users
      let objectUser = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hash, // Hashed password
        jobId: 1, // Default job ID
        // isAdmin: 0, // Default: not an admin
      };

      // Check if there are no users in the system (first user becomes admin)
      Users.findAll().then((user) => {
        if (!user || user.length == 0) {
          // Create default job
          Jobs.create({ ...objectJobs }).then((jobs) => {
            console.log(jobs);
          });

          // Grant admin rights to the first user
          objectUser = {
            ...objectUser,
            // isAdmin: 1,
          };
        }

        // Create the new user
        Users.create({ ...objectUser }).then((user) => {
          res.status(201).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id },
              "RANDOM_TOKEN_SECRET", // Secret key for signing the token
              { expiresIn: "24h" } // Token expires in 24 hours
            ),
          });
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Edit user profile.
exports.userEdit = (req, res) => {
  let forDelete = false;
  if (req.params.delete == 1) forDelete = true; // Check if user is being deleted
  let userId = req.params.id;
  let objectUser = { ...req.body }; // Create the object to hold the updated user data

  Users.findOne({ where: { id: userId, isDelete: false } })
    .then((user) => {
      // If the user wants to update their avatar
      if (req.file && user.avatar) {
        const filename = user.avatar.split("/avatars/")[1]; // Extract the avatar filename
        fs.unlink(`avatars/${filename}`, () => {
          console.log("--- Avatar deleted!");
        });
        objectUser = {
          ...objectUser,
          avatar: `${req.protocol}://${req.get("host")}/avatars/${req.file.filename
            }`, // Set new avatar URL
        };
      }

      // If the user wants to update their password
      if (objectUser.password) {
        const newPass = bCrypt.hashSync(objectUser.password, 10); // Hash the new password
        objectUser = {
          ...objectUser,
          password: `${newPass}`, // Set new hashed password
        };
      }

      // If the user is deleting their account
      if (forDelete) {
        if (user.avatar && user.avatar != "none") {
          const filename = user.avatar.split("/avatars/")[1]; // Extract avatar filename
          fs.unlink(`avatars/${filename}`, () => {
            console.log("--- Avatar deleted!");
          });
        }
        objectUser = {
          ...objectUser,
          firstname: "Complete",
          lastname: "Inactive", // Set to "Inactive Account"
          avatar: "none",
          isDelete: `${forDelete}`, // Mark the account as deleted
        };
      }

      // Update the user's profile
      Users.update({ ...objectUser }, { where: { id: user.id } })
        .then(() => res.status(200).json({ message: "Profile updated!" }))
        .catch((error) => res.status(400).json({ error: error }));
    })
    .catch(() => {
      console.error("Unable to find this user!");
    });
};

// Delete user account or avatar.
exports.userDel = (req, res) => {
  let isAvatar = false;
  if (req.params.avatar == 1) isAvatar = true; // Check if only the avatar should be deleted

  let userId = req.params.id;
  Users.findOne({ where: { id: userId } })
    .then((user) => {
      // If the user wants to delete their avatar
      if (isAvatar && userId) {
        const filename = user.avatar.split("/avatars/")[1]; // Extract avatar filename
        fs.unlink(`avatars/${filename}`, () => {
          console.log("--- Avatar deleted!");
        });

        // Update the user's avatar to 'none'
        Users.update({ avatar: "none" }, { where: { id: userId } })
          .then(() => {
            return res.status(200).json({ message: "Avatar deleted!" });
          })
          .catch(() => {
            return res.status(304); // Return "Not Modified" status if update fails
          });
      }
      // If the user wants to delete their account
      else {
        if (user.avatar != "none") {
          const filename = user.avatar.split("/avatars/")[1]; // Extract avatar filename
          fs.unlink(`avatars/${filename}`, () => {
            console.log("--- Avatar deleted!");
          });
        }

        // Delete the user's account
        Users.destroy({ where: { id: userId } })
          .then(() => {
            return res.status(200).json({ message: "Account deleted!" });
          })
          .catch(() => {
            return res.status(304).json({ message: "Account not deleted!" });
          });
      }
    })
    .catch(() => {
      console.error("Unable to find this user!");
    });
};
