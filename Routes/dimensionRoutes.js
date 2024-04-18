const express = require("express");
const { verifyToken } = require("../Utils/jwt");
const {
  getAll,
  createDimension,
  addDimensionTransaction,
  getDimension,
} = require("../Controllers/dimensionController");
const router = express.Router();
router.get("/", verifyToken, getAll);
router.get("/:id", verifyToken, getDimension);
router.post("/", verifyToken, createDimension);
router.post("/transaction/:id", verifyToken, addDimensionTransaction);
module.exports = router;
