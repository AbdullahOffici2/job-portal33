const express   = require("express");
const mongoose  = require("mongoose");
const bcrypt    = require("bcryptjs");
const cors      = require("cors");
const path      = require("path");
const multer    = require("multer");
const fs        = require("fs");

const User        = require("./models/User");
const Application = require("./models/Application");

const app       = express();
const PORT      = process.env.PORT      || 3000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/jobportal";

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve all frontend pages (HTML/CSS/JS) from ../frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Serve uploaded resumes
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
app.use("/uploads", express.static(uploadsDir));

// ── Multer (PDF resume upload) ─────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename:    (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"));
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── MongoDB ────────────────────────────────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅  MongoDB connected"))
  .catch(err => console.error("❌  MongoDB error:", err.message));

// ── API Routes ─────────────────────────────────────────────────────────────────

// REGISTER
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required." });

    if (await User.findOne({ email }))
      return res.status(409).json({ message: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashed }).save();
    res.status(201).json({ message: "Registration successful! You can now log in." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required." });

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password." });

    res.json({ message: "Login successful!", user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// APPLY
app.post("/api/apply", upload.single("resume"), async (req, res) => {
  try {
    const { fullName, email, phone, jobRole, skills, experience, coverLetter } = req.body;
    if (!fullName || !email || !phone || !jobRole || !skills || experience === undefined)
      return res.status(400).json({ message: "Please fill all required fields." });
    if (!req.file)
      return res.status(400).json({ message: "Resume (PDF) is required." });

    await new Application({
      fullName, email, phone, jobRole, skills,
      experience: Number(experience), coverLetter,
      resumePath: req.file.filename,
    }).save();

    res.status(201).json({ message: "Application submitted successfully! We'll be in touch soon." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while submitting application." });
  }
});

// GET ALL APPLICATIONS (admin)
app.get("/api/applications", async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: "Server error." });
  }
});

// ── Fallback → index.html ──────────────────────────────────────────────────────
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.listen(PORT, () =>
  console.log(`🚀  Server running at http://localhost:${PORT}`)
);
