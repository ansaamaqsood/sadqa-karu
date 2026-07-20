// DONATION MODEL — all donation database queries
const db = require("../config/db");
const createDonation = (user_id, title, description, condition_status, phone, address, image, callback) => {
  const sql = `
    INSERT INTO donations
      (user_id, title, description, item_condition, phone, pickup_address, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, title, description, condition_status, phone, address, image], callback);
};

// Create donation
//const createDonation = (user_id, title, description, condition_status, phone, address, image, callback) => {
 // const sql = `
  //  INSERT INTO donations (user_id, title, description, condition_status, phone, address, image)
    //VALUES (?, ?, ?, ?, ?, ?, ?)
  //`;
  //db.query(sql, [user_id, title, description, condition_status, phone, address, image], callback);
//};

// Get all donations with donor name
const getAllDonations = (callback) => {
  const sql = `
    SELECT donations.*, users.name AS donor_name
    FROM donations
    JOIN users ON donations.user_id = users.id
    ORDER BY donations.created_at DESC
  `;
  db.query(sql, callback);
};

// Get donation count
const getDonationCount = (callback) => {
  db.query("SELECT COUNT(*) AS count FROM donations", callback);
};

// Update donation
const updateDonation = (id, user_id, title, description, phone, address, callback) => {
  const sql = `
    UPDATE donations
    SET title = ?, description = ?, phone = ?, address = ?
    WHERE id = ? AND user_id = ?
  `;
  db.query(sql, [title, description, phone, address, id, user_id], callback);
};

// Delete donation
const deleteDonation = (id, user_id, callback) => {
  db.query("DELETE FROM donations WHERE id = ? AND user_id = ?", [id, user_id], callback);
};

// Accept donation
const acceptDonation = (id, callback) => {
  db.query("UPDATE donations SET status = 'accepted' WHERE id = ?", [id], callback);
};

module.exports = { createDonation, getAllDonations, getDonationCount, updateDonation, deleteDonation, acceptDonation };