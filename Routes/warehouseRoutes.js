const express = require("express");
const { verifyToken } = require("../Utils/jwt");
const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  stockTransfer,
  addItemInWarehouse,
} = require("../Controllers/warehouseController");
const router = express.Router();
router.get("/", verifyToken, getWarehouses);
router.get("/:id", verifyToken, getWarehouse);
router.post("/", verifyToken, createWarehouse);
router.post("additem/:id", verifyToken, addItemInWarehouse);
router.post("/stocktransfer/:id", verifyToken, stockTransfer);

module.exports = router;
