// ADMIN ROUTES
const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { getAllUsers, getPendingNGOs, getPendingVolunteers, approveNGO, rejectNGO, approveVolunteer, rejectVolunteer } = require("../controllers/adminController");

// Middleware — admin only check
function adminOnly(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin only." });
  }
  next();
}

router.get("/users",                  verifyToken, adminOnly, getAllUsers);
router.get("/pending-ngos",           verifyToken, adminOnly, getPendingNGOs);
router.get("/pending-volunteers",     verifyToken, adminOnly, getPendingVolunteers);
router.post("/approve-ngo/:id",       verifyToken, adminOnly, approveNGO);
router.post("/reject-ngo/:id",        verifyToken, adminOnly, rejectNGO);
router.post("/approve-volunteer/:id", verifyToken, adminOnly, approveVolunteer);
router.post("/reject-volunteer/:id",  verifyToken, adminOnly, rejectVolunteer);

module.exports = router;