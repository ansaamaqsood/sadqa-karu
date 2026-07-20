// NGO MODEL — all NGO database queries
const db = require("../config/db");

// Add new NGO — starts as pending
const addNGO = (user_id, name, description, location, callback) => {
  const sql = "INSERT INTO ngos (user_id, name, description, location, status) VALUES (?, ?, ?, ?, 'pending')";
  db.query(sql, [user_id, name, description, location], callback);
};

// Get all approved NGOs
const getAllNGOs = (callback) => {
  const sql = "SELECT * FROM ngos WHERE status = 'approved'";
  db.query(sql, callback);
};

// Get NGO by ID
const getNGOById = (id, callback) => {
  const sql = "SELECT * FROM ngos WHERE id = ?";
  db.query(sql, [id], callback);
};

// Get NGO count
const getNGOCount = (callback) => {
  db.query("SELECT COUNT(*) AS count FROM ngos WHERE status = 'approved'", callback);
};

// Get pending NGOs with user email
const getPendingNGOs = (callback) => {
  const sql = `
    SELECT ngos.*, users.email, users.phone
    FROM ngos
    JOIN users ON ngos.user_id = users.id
    WHERE ngos.status = 'pending'
  `;
  db.query(sql, callback);
};

// Approve NGO
const approveNGO = (id, callback) => {
  db.query("UPDATE ngos SET status = 'approved' WHERE id = ?", [id], callback);
};

// Reject NGO
const rejectNGO = (id, callback) => {
  db.query("DELETE FROM ngos WHERE id = ?", [id], callback);
};

// Get NGO with user email by ID
const getNGOWithEmail = (id, callback) => {
  const sql = `
    SELECT ngos.*, users.email, users.name
    FROM ngos
    JOIN users ON ngos.user_id = users.id
    WHERE ngos.id = ?
  `;
  db.query(sql, [id], callback);
};

module.exports = { addNGO, getAllNGOs, getNGOById, getNGOCount, getPendingNGOs, approveNGO, rejectNGO, getNGOWithEmail };