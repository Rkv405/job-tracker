const pool = require("../config/db");

const getProfile = async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM profile LIMIT 1");

        if (rows.length === 0) {
            await pool.query("INSERT INTO profile () VALUES ()");
            const [newProfile] = await pool.query("SELECT * FROM profile LIMIT 1");
            return res.json(newProfile[0]);
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { name, college, branch, cgpa, graduation, skills, github, linkedin } = req.body;

        const [rows] = await pool.query("SELECT * FROM profile LIMIT 1");

        if (rows.length === 0) {
            await pool.query(
                "INSERT INTO profile (name, college, branch, cgpa, graduation, skills, github, linkedin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                [name, college, branch, cgpa, graduation, skills, github, linkedin]
            );
        } else {
            await pool.query(
                "UPDATE profile SET name=?, college=?, branch=?, cgpa=?, graduation=?, skills=?, github=?, linkedin=? WHERE id=?",
                [name, college, branch, cgpa, graduation, skills, github, linkedin, rows[0].id]
            );
        }

        if (req.file) {
            await pool.query(
                "UPDATE profile SET resume=? WHERE id=?",
                [req.file.filename, rows[0].id]
            );
        }

        const [updated] = await pool.query("SELECT * FROM profile LIMIT 1");
        res.json(updated[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getProfile, updateProfile };