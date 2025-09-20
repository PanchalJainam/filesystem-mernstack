const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const router = require("./routes");

dotenv.config();
require("./db/connection");

const app = express();

const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = process.env.UPLOAD_DIR || "uploads";

// Ensure upload dir exists
const uploadPath = path.join(__dirname, UPLOAD_DIR);
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Core middleware
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

app.use(morgan("dev"));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://192.168.10.76:5173"],
    credentials: true,
  })
);

app.use("/", router);
app.use("/uploads", express.static("uploads"));

// Health
app.get("/health", (_, res) => res.json({ ok: true }));

if (process.env.NODE_ENV === "production") {
  const buildPath = path.join(__dirname, "client", "build");
  app.use(express.static(buildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(buildPath, "index.html"));
  });
}

app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
// Basic error handler (catches thrown errors/rejections)
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || "Server error" });
});
