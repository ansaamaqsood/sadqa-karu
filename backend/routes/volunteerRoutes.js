// VOLUNTEER ROUTES
const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addVolunteer, getAllVolunteers, getVolunteerCount } = require("../controllers/volunteerController");

router.get("/",       getAllVolunteers);               // GET  /volunteers
router.get("/count",  getVolunteerCount);              // GET  /volunteers/count
router.post("/",      verifyToken, addVolunteer);      // POST /volunteers

module.exports = router;