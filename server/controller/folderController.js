const Files = require("../models/fileSchema");
const Folder = require("../models/folderSchema");

// Create a new folder
exports.createFolder = async (req, res) => {
  try {
    const { name, parentFolder } = req.body;
    const userId = req.user._id; // Assuming you have auth middleware

    if (!name) {
      return res.status(400).json({ message: "Folder name is required" });
    }

    const newFolder = await Folder.create({ name, parentFolder, userId });
    return res.status(201).json({ folder: newFolder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all folders for a user
exports.getFolders = async (req, res) => {
  try {
    const userId = req.user._id;

    const folders = await Folder.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ folders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a single folder
exports.getFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const folder = await Folder.findById(folderId).lean();

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json({ folder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Rename folder
exports.renameFolder = async (req, res) => {
  try {
    const folder = await Folder.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!folder) return res.status(404).json({ message: "Folder not found" });
    res.json(folder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete folder (soft delete by default)
exports.deleteFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    const { permanent } = req.query;

    if (permanent === "true") {
      // Permanent delete: delete all files + folder
      await Files.deleteMany({ folder: folder._id });
      await Folder.deleteOne({ _id: folder._id });

      return res.json({ message: "Folder and its files permanently deleted" });
    } else {
      // Soft delete: mark folder and its files as deleted
      folder.deleted = true;
      await folder.save();

      await Files.updateMany({ folder: folder._id }, { deleted: true });

      return res.json({ message: "Folder and its files moved to Bin" });
    }
  } catch (err) {
    console.error("❌ Delete folder error:", err);
    res.status(500).json({ message: err.message });
  }
};

//  Get deleted folders
exports.getDeletedFolders = async (req, res) => {
  try {
    console.log("REQ.USER:", req.user);
    const folders = await Folder.find({
      userId: req.user._id,
      deleted: true,
    });
    res.json({ folders });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Restore folder
exports.restoreFolder = async (req, res) => {
  try {
    const folder = await Folder.findById(req.params.id);
    if (!folder) return res.status(404).json({ message: "Folder not found" });

    if (!folder.deleted) {
      return res.status(400).json({ message: "Folder is not in Bin" });
    }

    folder.deleted = false;
    await folder.save();

    // Restore all files inside folder
    await Files.updateMany({ folder: folder._id }, { deleted: false });

    res.json({ message: "Folder restored successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
