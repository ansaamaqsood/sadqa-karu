// NGO CONTROLLER — NGO logic
const ngoModel = require("../models/ngosModel");

// ADD NGO
const addNGO = (req, res) => {
  const { name, description, location, user_id } = req.body;
  ngoModel.addNGO(user_id, name, description, location, (err) => {
    if (err) return res.status(500).json({ message: "Error adding NGO." });
    res.json({ message: "NGO registered. Waiting for admin approval." });
  });
};

// GET ALL APPROVED NGOs
const getAllNGOs = (req, res) => {
  ngoModel.getAllNGOs((err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching NGOs." });
    res.json(result);
  });
};

// GET NGO BY ID
const getNGOById = (req, res) => {
  ngoModel.getNGOById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    if (result.length === 0) return res.status(404).json({ message: "NGO not found." });
    res.json(result[0]);
  });
};

// GET NGO COUNT
const getNGOCount = (req, res) => {
  ngoModel.getNGOCount((err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json({ count: result[0].count });
  });
};

module.exports = { addNGO, getAllNGOs, getNGOById, getNGOCount };