// controllers/uploadController.js
const Files = require("../models/fileSchema");
const cloudinary = require("cloudinary").v2;

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📌 Upload multiple files (with optional folder & deleted flag)
exports.uploadFile = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    const { folderId, deleted = false } = req.body;

    const uploadedFiles = await Promise.all(
      req.files.map((file) =>
        Files.create({
          owner: req.user._id,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          url: file.path,
          public_id: file.filename,
          folder: folderId || null,
          deleted: deleted, // soft delete support
        })
      )
    );

    res.status(201).json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all user files (optionally by folder)
// By default, fetch only non-deleted files. Add ?bin=true to fetch deleted files.
exports.getMyFiles = async (req, res) => {
  try {
    const folderId = req.params.folderId || null;
    const bin = req.query.bin === "true"; // fetch deleted files if true

    const query = { owner: req.user._id, deleted: bin ? true : false };
    if (folderId) query.folder = folderId;

    const files = await Files.find(query).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

//  Update (rename) a file
exports.updateFile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ error: "New name is required" });
    }

    const fileDoc = await Files.findById(id);
    if (!fileDoc) return res.status(404).json({ error: "File not found" });

    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this file" });
    }

    fileDoc.originalName = name.trim();
    await fileDoc.save();

    res.json({ message: "File renamed successfully", file: fileDoc });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Delete a file (soft delete by default, permanent delete if ?permanent=true)
exports.deleteFile = async (req, res) => {
  try {
    const fileDoc = await Files.findById(req.params.id);
    if (!fileDoc) return res.status(404).json({ error: "File not found" });

    if (fileDoc.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this file" });
    }

    const { permanent } = req.query;

    if (permanent === "true") {
      // Permanent delete: remove from Cloudinary
      const result = await cloudinary.uploader.destroy(fileDoc.public_id, {
        resource_type: "raw",
      });
      console.log("🗑 Cloudinary delete response:", result);

      if (result.result !== "ok" && result.result !== "not found") {
        return res
          .status(500)
          .json({ error: "Cloudinary deletion failed", details: result });
      }

      await fileDoc.deleteOne();
      return res.json({ message: "File permanently deleted" });
    } else {
      // Soft delete: move to Bin
      fileDoc.deleted = true;
      await fileDoc.save();
      return res.json({ message: "File moved to Bin" });
    }
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};

//  Restore a soft-deleted file
exports.restoreFile = async (req, res) => {
  try {
    const file = await Files.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ error: "File not found" });
    }

    if (!file.deleted) {
      return res.status(400).json({ error: "File is already restored", file });
    }

    file.deleted = false;
    await file.save();

    res.json({ message: "File restored successfully", file });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
