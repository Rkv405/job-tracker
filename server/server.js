const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const pool = require("./config/db");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create uploads folder if missing
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

// serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// serve frontend
app.use(express.static(path.join(__dirname, "../client")));

// api routes
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));

// test db connection on startup
pool.query("SELECT 1")
    .then(() => console.log("MySQL Connected Successfully"))
    .catch(err => console.error("MySQL Connection Error:", err.message));

// serve jt.html for all other routes
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/jt.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));