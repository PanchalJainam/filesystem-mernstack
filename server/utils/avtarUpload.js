// avatarUpload.js
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const { cloudinary } = require("./cloudinary"); // reuse cloud config

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let cleanName = file.originalname
      .split(".")[0]
      .replace(/[^a-zA-Z0-9_-]/g, "");
    if (!cleanName) cleanName = "avatar";
    return {
      folder: "user_avatars", // ✅ fixed folder for profile pics
      resource_type: "image",
      public_id: `${cleanName}-${Date.now()}`,
      transformation: [{ width: 200, height: 200, crop: "fill" }],
    };
  },
});

const avatarUpload = multer({ storage: avatarStorage });

module.exports = { avatarUpload };
