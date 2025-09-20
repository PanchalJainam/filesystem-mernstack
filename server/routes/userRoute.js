const express = require("express");
const { updateUser, getUserDetails } = require("../controller/userController");
const auth = require("../middleware/auth");
const { avatarUpload } = require("../utils/avtarUpload");

const router = express.Router();

// Get user details
router.get("/me", auth, getUserDetails);

router.put("/update", auth, avatarUpload.single("avatar"), updateUser);

module.exports = router;
