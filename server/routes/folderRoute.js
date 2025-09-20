const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  createFolder,
  getFolders,
  getFolder,
  renameFolder,
  deleteFolder,
  restoreFolder,
  getDeletedFolders,
} = require("../controller/folderController");

// Create folder
router.post("/create", auth, createFolder);

// Get all folders
router.get("/", auth, getFolders);

// Get deleted folders (Bin)
router.get("/bin", auth, getDeletedFolders);

// Get single folder
router.get("/:id", auth, getFolder);

// Rename folder
router.put("/:id", auth, renameFolder);

// Delete folder
router.delete("/:id", auth, deleteFolder);

// Restore folder
router.put("/restore/:id", auth, restoreFolder);

module.exports = router;
