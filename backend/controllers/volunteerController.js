// VOLUNTEER CONTROLLER — volunteer logic
const volunteerModel = require("../models/volunteerModel");

// ADD VOLUNTEER POST
//const addVolunteer = (req, res) => {
  //const { profession, service, description, capacity, location, phone, availability, image } = req.body;
 // const user_id = req.user.id;

  //volunteerModel.addVolunteer(user_id, profession, service, description, capacity, location, phone, availability, image, (err) => {
   // if (err) return res.status(500).json({ message: "Error posting volunteer work." });
   // res.json({ message: "Volunteer post added successfully!" });
 // });
//};
// ADD VOLUNTEER POST
const addVolunteer = (req, res) => {
  const { profession, service, description, capacity, location, phone, availability, image } = req.body;
  const user_id = req.user.id;

  volunteerModel.addVolunteer(user_id, profession, service, description, capacity, location, phone, availability, image, (err) => {
    if (err) {
      console.log("Volunteer error:", err);   // ← this is the new line
      return res.status(500).json({ message: "Error posting volunteer work." });
    }
    res.json({ message: "Volunteer post added successfully!" });
  });
};

// GET ALL VOLUNTEERS
const getAllVolunteers = (req, res) => {
  volunteerModel.getAllVolunteers((err, result) => {
    if (err) return res.status(500).json({ message: "Error fetching volunteers." });
    res.json(result);
  });
};

// GET VOLUNTEER COUNT
const getVolunteerCount = (req, res) => {
  volunteerModel.getVolunteerCount((err, result) => {
    if (err) return res.status(500).json({ message: "Error." });
    res.json({ count: result[0].count });
  });
};

module.exports = { addVolunteer, getAllVolunteers, getVolunteerCount };