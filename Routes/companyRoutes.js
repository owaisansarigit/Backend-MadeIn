const express = require("express");
const router = express.Router();
const {
  createCompany,
  login,
  addLocation,
  getlocations,
  getUsers,
  createUser,
  // verifyToken,
} = require("../Controllers/companyController");
const { verifyToken } = require("../Utils/jwt");
const {
  getDocuments,
  getDocument,
  updateDocumentAprooval,
} = require("../Controllers/DocumentListController");
router.post("/", createCompany);
router.post("/login", login);
router.get("/getlocations", verifyToken, getlocations);
router.get("/getusers", verifyToken, getUsers);
router.post("/createuser", verifyToken, createUser);
router.post("/addlocation", verifyToken, addLocation);

// document list

router.get("/doclist/all", verifyToken, getDocuments);
router.get("/doclist/type/:type", verifyToken, getDocument);
router.put("/doclist/updateaprooval/:id", verifyToken, updateDocumentAprooval);

module.exports = router;
