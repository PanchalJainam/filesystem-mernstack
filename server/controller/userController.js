const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const cloudinary = require("cloudinary").v2;

exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { name, email, password } = req.body; // accept 'password' directly

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Update name & email
    if (name) user.name = name;
    if (email) user.email = email;

    // ✅ Update password directly if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ✅ Handle avatar upload
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_avatars",
        transformation: [{ width: 200, height: 200, crop: "fill" }],
      });
      user.avatar = result.secure_url;
    }

    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
