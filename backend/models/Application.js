const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    fullName:    { type: String, required: true, trim: true },
    email:       { type: String, required: true, lowercase: true, trim: true },
    phone:       { type: String, required: true, trim: true },
    jobRole:     { type: String, required: true, enum: ["Java Developer","Python Developer","Web Developer","UI/UX Designer","Data Analyst"] },
    skills:      { type: String, required: true },
    experience:  { type: Number, required: true, min: 0 },
    coverLetter: { type: String, default: "" },
    resumePath:  { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
