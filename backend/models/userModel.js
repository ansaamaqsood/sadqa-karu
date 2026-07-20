// USER MODEL — all user database queries
const db = require("../config/db");

// Insert new user
const createUser = (name, email, hashedPassword, role, phone, city, callback) => {
  const sql = "INSERT INTO users (name, email, password, role, phone, city) VALUES (?, ?, ?, ?, ?, ?)";
  db.query(sql, [name, email, hashedPassword, role, phone, city], callback);
};

// Find user by email
const findUserByEmail = (email, callback) => {
  const sql = "SELECT * FROM users WHERE email = ?";
  db.query(sql, [email], callback);
};

// Get all users — admin only
const getAllUsers = (callback) => {
  const sql = "SELECT id, name, email, role, phone, city, created_at FROM users";
  db.query(sql, callback);
};

module.exports = { createUser, findUserByEmail, getAllUsers };