// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const User = require("../models/userSchema");

// function sign(userId) {
//   return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
// }

// // register (no token returned)
// exports.register = async (req, res) => {
//   const { name, email, password } = req.body || {};
//   if (!email || !password)
//     return res.status(400).json({ error: "email & password required" });

//   const exists = await User.findOne({ email });
//   if (exists)
//     return res.status(409).json({ error: "Email already registered" });

//   const hashPwd = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashPwd });

//   res.status(201).json({ message: "User registered successfully" });
// };

// exports.login = async (req, res) => {
//   const { email, password } = req.body || {};
//   if (!email || !password)
//     return res.status(400).json({ error: "email & password required" });

//   const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ error: "Invalid credentials" });

//   const ok = await bcrypt.compare(password, user.password);
//   if (!ok) return res.status(400).json({ error: "Invalid credentials" });

//   const token = sign(user._id);
//   const { password: pwd, ...safeUser } = user.toObject();
//   res.json({ user: safeUser, token });
// };

// // router.get("/me", require("../middleware/auth"), async (req, res) => {
// //   res.json({ user: req.user });
// // });

// // module.exports = router;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userSchema");
const crypto = require("crypto");
const Otps = require("../models/otpSchema");
const sendEmail = require("../utils/sendEmail");

function sign(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    let user = await User.findOne({ email });

    if (!user) {
      const hashPwd = await bcrypt.hash(password, 10);
      user = await User.create({ email, password: hashPwd });
    } else {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    await Otps.findOneAndUpdate(
      { email },
      { email, otp: hashedOtp, expiresAt: Date.now() + 5 * 60 * 1000 },
      { upsert: true }
    );

    await sendEmail(
      email,
      otp,
      `<h3>Welcome to File System App</h3><p>Your OTP is: <b>${otp}</b></p>`
    );

    res.json({ message: "OTP sent to your email. Please verify." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// STEP 2: verify OTP → issue JWT
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ error: "Email & OTP required" });

    const record = await Otps.findOne({ email });
    if (!record) return res.status(400).json({ error: "OTP not found" });

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ error: "OTP expired" });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");
    if (record.otp !== hashedOtp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    await Otps.deleteOne({ email });

    const user = await User.findOne({ email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ message: "OTP verified successfully", token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
