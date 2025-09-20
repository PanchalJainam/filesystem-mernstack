// const mongoose = require("mongoose");

// const fileSchema = new mongoose.Schema(
//   {
//     originalName: { type: String, required: true },
//     filename: { type: String, required: true },
//     path: { type: String, required: true },
//     size: { type: Number, required: true },
//     mimetype: { type: String, required: true },
//     owner: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

// const Files = mongoose.model("Files", fileSchema);

// module.exports = Files;

// models/fileSchema.js
const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: { type: String, required: true },
    mimetype: String,
    size: Number,
    url: String,
    public_id: String,
    folder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Folder",
      default: null,
    },
    deleted: { type: Boolean, default: false }, // ✅ soft delete
  },
  { timestamps: true }
);

const Files = mongoose.model("Files", fileSchema);

module.exports = Files;
