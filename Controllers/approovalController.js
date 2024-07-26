const asynchandler = require("express-async-handler");
const PendingTask = require("../Models/PendingTaskModel");
const response = require("../Utils/resHandler");

const createTask = asynchandler(async (req, res) => {
  try {
    const { firstApproover, finalApproover, endPoint, data, type } = req.body;

    if (!firstApproover || !finalApproover || !endPoint || !data || !type) {
      response.errorResponse(res, "Please Send All Details");
    }

    const newTask = new PendingTask({
      firstApproover,
      finalApproover,
      type,
      endPoint,
      data,
    });
    const savedTask = await newTask.save();

    return response.successResponse(
      res,
      savedTask,
      "Task created successfully"
    );
  } catch (e) {
    console.error(e);
    response.errorResponse(res, "Internal server error");
  }
});
const getTask = asynchandler(async (req, res) => {
  try {
    const userId = req.user.userId;
    const tasks = await PendingTask.find({
      $or: [{ firstApproover: userId }, { finalApproover: userId }],
    })
      .populate("firstApproover")
      .populate("finalApproover");
    if (tasks.length > 0) {
      return response.successResponse(res, tasks, "Data fetched successfully");
    }

    return response.successResponse(res, tasks, "Data not found");
  } catch (e) {
    console.error(e);
    response.errorResponse(res, "Internal server error");
  }
});

const updateTask = asynchandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.userId;

    let task = await PendingTask.findById(taskId);
    if (!task) {
      return response.errorResponse(res, "Task not found");
    }
    // Check and update the first approval
    if (!task.firstApproove && task.firstApproover == userId) {
      task.firstApproove = true;
      await task.save();
      return response.successResponse(
        res,
        task,
        "Task first approval updated successfully"
      );
    }
    // Check and update the final approval
    if (!task.finalApproove && task.finalApproover == userId) {
      task.finalApproove = true;
      await task.save();
      return response.successResponse(
        res,
        task,
        "Task final approval updated successfully"
      );
    }
    return response.errorResponse(res, "No approval action taken");
  } catch (e) {
    console.error(e);
    return response.errorResponse(res, "Internal server error");
  }
});

const deleteTask = asynchandler(async (req, res) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await PendingTask.findByIdAndDelete(taskId);

    if (deletedTask) {
      return response.successResponse(
        res,
        deletedTask,
        "Task deleted successfully"
      );
    }

    return response.notFoundError(res, "Task not found");
  } catch (e) {
    console.error(e);
    response.errorResponse(res, "Internal server error");
  }
});

module.exports = { getTask, createTask, deleteTask, updateTask };
