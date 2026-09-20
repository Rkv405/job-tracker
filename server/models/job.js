const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["Applied", "OA", "Interview", "Offer", "Rejected"],
        default: "Applied"
    },
    dateApplied: {
        type: String,
        default: ""
    },
    link: {
        type: String,
        default: ""
    },
    notes: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);