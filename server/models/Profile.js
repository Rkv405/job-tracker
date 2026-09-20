const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: { type: String, default: "" },
    college: { type: String, default: "" },
    branch: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    graduation: { type: String, default: "" },
    skills: { type: String, default: "" },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    resume: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);