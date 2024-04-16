const express = require("express");
const router = express.Router();
const {
  createCompany,
  login,
  verifyToken,
} = require("../Controllers/companyController");
router.post("/", createCompany);
router.post("/login", login);
router.post("/verifytoke", verifyToken);
module.exports = router;
