const express = require("express");
const {
  getCats,
  createCat,
  updateCat,
  addSubCat,
} = require("../Controllers/itemCatController");
const router = express.Router();
router.get("/", getCats);
router.post("/", createCat);
router.put("/:id", updateCat);
router.post("/:id/addsubcat", addSubCat);
module.exports = router;
