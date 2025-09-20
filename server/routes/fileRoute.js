const express = require("express");
const router = express.Router();
const {
  uploadFile,
  getMyFiles,
  deleteFile,
  updateFile,
  restoreFile,
} = require("../controller/uploadController");
const auth = require("../middleware/auth");
const { upload } = require("../utils/cloudinary");

// Upload File (supports multiple files)
router.post("/upload", auth, upload.array("files", 10), uploadFile);

// Get All Files (non-deleted by default)
router.get("/allfiles", auth, getMyFiles);

// Get Files by Folder ID (non-deleted by default)
router.get("/allfiles/:folderId", auth, getMyFiles);

// Update (rename) a file
router.put("/update/:id", auth, updateFile);

// Delete File
router.delete("/delete/:id", auth, deleteFile);

// Restore File from Bin
router.put("/restore/:id", auth, restoreFile);

module.exports = router;
