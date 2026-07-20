// NGO ROUTES
const express     = require("express");
const router      = express.Router();
const verifyToken = require("../middleware/verifyToken");
const { addNGO, getAllNGOs, getNGOById, getNGOCount } = require("../controllers/ngoController");

router.get("/",        getAllNGOs);              // GET  /ngos
router.get("/count",   getNGOCount);             // GET  /ngos/count
router.get("/:id",     getNGOById);              // GET  /ngos/:id
router.post("/",       addNGO);                  // POST /ngos

module.exports = router;