const express = require("express");
const {
  getCIP,
  getCIPs,
  createCIP,
  deleteCIP,
  updateCIP,
} = require("../Controllers/customerItemPriceController");
const router = express.Router();
router.get("/:id", getCIP);
router.get("/", getCIPs);
router.post("/", createCIP);
router.put("/:id", updateCIP);
router.delete("/:id", deleteCIP);

module.exports = router;
