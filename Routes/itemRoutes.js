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
const upload = multer({ dest: "uploads/" });

router.get("/", getItems);
router.get("/:id", getItem);
router.post("/", upload.single("image"), createItem);
router.put("/:id", updateItem);
router.put("/:id/pricing", updatePricing);
router.put("/:id/inventory", updateInventory);
router.put("/:id/vender", updateVender);
router.put("/:id/dimension", updateDimension);
router.put("/:id/image", upload.single("image"), updateImage);
router.delete("/:id", deleteItem);

module.exports = router;
