const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { getProfile, updateProfile } = require("../controllers/profileController");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, "../uploads")),
    filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

router.get("/", getProfile);
router.put("/", upload.single("resume"), updateProfile);

module.exports = router;