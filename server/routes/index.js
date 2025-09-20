const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoute");
const fileRoutes = require("./fileRoute");
const folderRoutes = require("./folderRoute");
const userRoutes = require("./userRoute");

router.use("/auth", authRoutes);
router.use("/files", fileRoutes);
router.use("/folder", folderRoutes);
router.use("/user", userRoutes);

module.exports = router;
