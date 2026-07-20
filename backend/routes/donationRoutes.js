// DONATION ROUTES
const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const {
  createDonation,
  getAllDonations,
  getDonationCount,
  updateDonation,
  deleteDonation,
  acceptDonation
} = require("../controllers/donationController");

router.get("/",           getAllDonations);                   // GET    /donations
router.get("/count",      getDonationCount);                  // GET    /donations/count
router.post("/",          verifyToken, createDonation);       // POST   /donations
router.put("/:id",        verifyToken, updateDonation);       // PUT    /donations/:id
router.delete("/:id",     verifyToken, deleteDonation);       // DELETE /donations/:id
router.put("/:id/accept", verifyToken, acceptDonation);       // PUT    /donations/:id/accept

module.exports = router;