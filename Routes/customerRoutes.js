const express = require("express");
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  addContactPerson,
  addAdress,
} = require("../Controllers/customerController");
const { verifyToken } = require("../Utils/jwt");
const router = express.Router();
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomer);
router.post("/", verifyToken, createCustomer);
router.put("/addcontactperson/:id", verifyToken, addContactPerson);
router.put("/addAdress/:id", verifyToken, addAdress);
router.put("/:id", verifyToken, updateCustomer);
router.delete("/:id", verifyToken, deleteCustomer);

module.exports = router;
