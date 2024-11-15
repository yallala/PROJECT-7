const multer = require("multer"); // Importing the multer package for file handling

// Define accepted MIME types and their corresponding file extensions
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
};

// Configuration for storing images
const storage = multer.diskStorage({
  // Define the destination directory for uploaded files
  destination: (req, file, callback) => {
    // If the file is an image, store it in the 'images' folder
    if (file.fieldname === "image") {
      callback(null, "images");
    }
    // Otherwise, store it in the 'avatars' folder (for profile pictures)
    else {
      callback(null, "avatars");
    }
  },
  // Define how the uploaded file should be named
  filename: (req, file, callback) => {
    // Replace spaces with underscores in the original filename
    const name = file.originalname.split(" ").join("_");

    // Get the file extension from the MIME type
    const extension = MIME_TYPES[file.mimetype];

    // Create the filename by appending a timestamp to ensure uniqueness
    callback(
      null,
      name.split("." + extension).join(Date.now()) + "." + extension
    );
  },
});

// Export the configured multer middleware for handling file uploads
module.exports = multer({ storage: storage });
