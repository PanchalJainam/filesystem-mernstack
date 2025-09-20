const express = require("express");
const { login, verifyOtp } = require("../controller/authCntroller");
const router = express.Router();

// Step 1: Login with email & password → sends OTP
router.post("/login", login);

// Step 2: Verify OTP → returns JWT
router.post("/verify-otp", verifyOtp);

module.exports = router;
