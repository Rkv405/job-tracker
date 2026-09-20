const pool = require("../config/db");

const getJobs = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM jobs ORDER BY createdAt DESC"
        );
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const createJob = async (req, res) => {
    try {
        const { company, role, status, dateApplied, link, notes } = req.body;

        if (!company) {
            return res.status(400).json({ message: "Company name is required" });
        }

        const [result] = await pool.query(
            "INSERT INTO jobs (company, role, status, dateApplied, link, notes) VALUES (?, ?, ?, ?, ?, ?)",
            [company, role, status, dateApplied, link, notes]
        );

        const [newJob] = await pool.query(
            "SELECT * FROM jobs WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json(newJob[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateJob = async (req, res) => {
    try {
        const { company, role, status, dateApplied, link, notes } = req.body;

        const [result] = await pool.query(
            "UPDATE jobs SET company=?, role=?, status=?, dateApplied=?, link=?, notes=? WHERE id=?",
            [company, role, status, dateApplied, link, notes, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        const [updatedJob] = await pool.query(
            "SELECT * FROM jobs WHERE id = ?",
            [req.params.id]
        );

        res.json(updatedJob[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteJob = async (req, res) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM jobs WHERE id = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.json({ message: "Job deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getJobs, createJob, updateJob, deleteJob };