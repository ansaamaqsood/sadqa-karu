// VOLUNTEER MODEL — all volunteer database queries
const db = require("../config/db");

// Add volunteer post
const addVolunteer = (user_id, profession, service, description, capacity, location, phone, availability, image, callback) => {
  const sql = `
    INSERT INTO volunteers (user_id, profession, service, description, capacity, location, phone, availability, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, profession, service, description, capacity, location, phone, availability, image], callback);
};

// Get all volunteers with name
const getAllVolunteers = (callback) => {
  const sql = `
    SELECT volunteers.*, users.name
    FROM volunteers
    JOIN users ON volunteers.user_id = users.id
    ORDER BY volunteers.created_at DESC
  `;
  db.query(sql, callback);
};

// Get volunteer count
const getVolunteerCount = (callback) => {
  db.query("SELECT COUNT(*) AS count FROM volunteers", callback);
};

// Get pending volunteers with email
const getPendingVolunteers = (callback) => {
  const sql = `
    SELECT volunteers.*, users.email, users.name
    FROM volunteers
    JOIN users ON volunteers.user_id = users.id
    WHERE volunteers.status = 'pending'
  `;
  db.query(sql, callback);
};

// Approve volunteer
const approveVolunteer = (id, callback) => {
  db.query("UPDATE volunteers SET status = 'accepted' WHERE id = ?", [id], callback);
};

// Reject volunteer
const rejectVolunteer = (id, callback) => {
  db.query("DELETE FROM volunteers WHERE id = ?", [id], callback);
};


// Get volunteer with email by ID
const getVolunteerWithEmail = (id, callback) => {
  const sql = `
    SELECT volunteers.*, users.email, users.name
    FROM volunteers
    JOIN users ON volunteers.user_id = users.id
    WHERE volunteers.id = ?
  `;
  db.query(sql, [id], callback);
};

module.exports = { addVolunteer, getAllVolunteers, getVolunteerCount, getPendingVolunteers, approveVolunteer, rejectVolunteer, getVolunteerWithEmail };