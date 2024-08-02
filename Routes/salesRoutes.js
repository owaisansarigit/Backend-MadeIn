const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Utils/jwt");
const {
  getAllSales,
  getSale,
  addSale,
  editSale,
  deleteSale,
} = require("../Controllers/salesController");

router.get("/", verifyToken, getAllSales);
router.get("/:id", verifyToken, getSale);
router.post("/", verifyToken, addSale);
router.put("/:id", verifyToken, editSale);
router.delete("/:id", verifyToken, deleteSale);

module.exports = router;
