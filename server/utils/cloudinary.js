const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Log check
console.log("Cloudinary Config:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "✅ Loaded" : "❌ Missing",
  secret: process.env.CLOUDINARY_API_SECRET ? "✅ Loaded" : "❌ Missing",
});

// ✅ Dynamic folder storage with sanitization
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Sanitize folder name
    const folderName = req.body.folder
      ? `user_uploads/${req.body.folder.replace(/[^a-zA-Z0-9_-]/g, "")}`
      : "user_uploads";

    // Sanitize filename
    let cleanName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9_-]/g, "");

    // Fallback if filename becomes empty
    if (!cleanName) {
      cleanName = "files";
    }

    return {
      folder: folderName,
      resource_type: "auto", // works for any file type
      access_mode: "public",
      public_id: `${cleanName}-${Date.now()}`,
    };
  },
});

const upload = multer({ storage });

module.exports = { cloudinary, upload };

// const cloudinary = require("cloudinary").v2;
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// const storage = new CloudinaryStorage({
//   cloudinary,
//   params: {
//     folder: "user_uploads", // all uploads go inside this folder
//     resource_type: "auto", // supports images, pdf, docs, etc
//     public_id: (req, file) => Date.now() + "-" + file.originalname, // unique name
//   },
// });

// const upload = multer({ storage });

// module.exports = { cloudinary, upload };
