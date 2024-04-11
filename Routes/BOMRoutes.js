const express = require("express");
const {
  getBOM,
  getBOMs,
  createBOM,
  updateBOM,
  deleteBOM,
} = require("../Controllers/billOfmaterial");
const router = express.Router();
router.get("/", getBOMs);
router.get("/:id", getBOM);
router.post("/", createBOM);
router.put("/:id", updateBOM);
router.delete("/:id", deleteBOM);
module.exports = router;
