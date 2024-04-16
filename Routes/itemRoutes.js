const express = require("express");
const {
  getItems,
  createItem,
  updateItem,
  deleteItem,
  getItem,
  updatePricing,
  updateInventory,
  updateVender,
  updateDimension,
  updateImage,
} = require("../Controllers/itemsCotroller");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../Utils/jwt");
const storage = multer.diskStorage({});
const upload = multer({ storage: storage });
router.get("/", verifyToken, getItems);
router.get("/:id", verifyToken, getItem);
router.post("/", verifyToken, upload.single("image"), createItem);
router.put("/:id", verifyToken, updateItem);
router.put("/:id/pricing", verifyToken, updatePricing);
router.put("/:id/inventory", verifyToken, updateInventory);
router.put("/:id/vender", verifyToken, updateVender);
router.put("/:id/dimension", verifyToken, updateDimension);
router.put("/:id/image", verifyToken, upload.single("image"), updateImage);
router.delete("/:id", verifyToken, deleteItem);

module.exports = router;
