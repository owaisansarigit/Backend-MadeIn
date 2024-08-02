const express = require("express");
const { verifyToken } = require("../Utils/jwt");
const router = express.Router();
const {
  getTask,
  createTask,
  updateTask,
  deleteTask,
} = require("../Controllers/approovalController");

router.get("/", verifyToken, getTask);
router.post("/", verifyToken, createTask);
router.post("/:taskId", verifyToken, updateTask);
router.delete("/:taskId", verifyToken, deleteTask);

module.exports = router;
