const express = require("express");
const router = express.Router();
const {
  createCompany,
  login,
  addLocation,
  getlocations,
  // verifyToken,
} = require("../Controllers/companyController");
const { verifyToken } = require("../Utils/jwt");
router.post("/", createCompany);
router.post("/login", login);
router.get("/getlocations", verifyToken, getlocations);
router.post("/addlocation", verifyToken, addLocation);
// router.post("/verifytoke", verifyToken);
module.exports = router;
