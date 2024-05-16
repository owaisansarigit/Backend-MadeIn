const express = require("express");
const router = express.Router();
const { verifyToken } = require("../Utils/jwt");
const {
  addPurchase,
  getAllPurchase,
  getPurchase,
  editPurchase,
  deletePurchase,
} = require("../Controllers/purchaseController");

router.get("/", verifyToken, getAllPurchase);
router.get("/:id", verifyToken), getPurchase;
router.post("/", verifyToken, addPurchase);
router.put("/:id", verifyToken, editPurchase);
router.delete("/:id", verifyToken, deletePurchase);

module.exports = router;
