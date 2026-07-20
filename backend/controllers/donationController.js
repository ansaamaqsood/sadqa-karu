// DONATION CONTROLLER
const donationModel = require("../models/donnationmodel");

// CREATE DONATION
const createDonation = (req, res) => {
  const { title, description, condition_status, phone, address, image } = req.body;
  const user_id = req.user.id;

  donationModel.createDonation(user_id, title, description, condition_status, phone, address, image, (err) => {
    if (err) return res.status(500).json({ message: "Error posting donation." });
    res.json({ message: "Donation posted successfully!" });
  });
};

// GET ALL DONATIONS
const getAllDonations = (req, res) => {
  donationModel.getAllDonations((err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching donations." });
    res.json(result);
  });
};

// GET DONATION COUNT
const getDonationCount = (req, res) => {
  donationModel.getDonationCount((err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json({ count: result[0].count });
  });
};

// UPDATE DONATION — donor edits their own
const updateDonation = (req, res) => {
  const { title, description, phone, address } = req.body;
  const id      = req.params.id;
  const user_id = req.user.id;

  donationModel.updateDonation(id, user_id, title, description, phone, address, (err, result) => {
    if (err) return res.status(500).json({ message: "Error updating donation." });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed." });
    res.json({ message: "Donation updated successfully!" });
  });
};

// DELETE DONATION — donor deletes their own
const deleteDonation = (req, res) => {
  const id      = req.params.id;
  const user_id = req.user.id;

  donationModel.deleteDonation(id, user_id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error deleting donation." });
    if (result.affectedRows === 0) return res.status(403).json({ message: "Not allowed." });
    res.json({ message: "Donation deleted successfully!" });
  });
};

// NGO ACCEPTS DONATION
const acceptDonation = (req, res) => {
  if (req.user.role !== "ngo") {
    return res.status(403).json({ message: "Only NGOs can accept donations." });
  }
  donationModel.acceptDonation(req.params.id, (err) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json({ message: "Donation accepted!" });
  });
};

module.exports = { createDonation, getAllDonations, getDonationCount, updateDonation, deleteDonation, acceptDonation };