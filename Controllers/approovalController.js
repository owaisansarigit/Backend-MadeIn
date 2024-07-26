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
    const userId = req.userId;

    const tasks = await PendingTask.find({
      $or: [{ firstApproover: userId }, { finalApproover: userId }],
    });

    if (tasks.length > 0) {
      return response.successResponse(res, tasks, "Data fetched successfully");
    }

    return response.notFoundError(res, "Data not found");
  } catch (e) {
    console.error(e);
    response.errorResponse(res, "Internal server error");
  }
});

const updateTask = asynchandler(async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;
    let task = await PendingTask.findById(taskId);

    if (task.firstApprooval === false) {
      if (task.firstApproover === userId) {
        task.firstApprooval = true;
        return response.successResponse(res, task, "Task updated successfully");
      }
    }
    if (task.finalApprooval === false) {
      if (task.finalApproover === userId) {
        task.finalApprooval = true;
        return response.successResponse(res, task, "Task updated successfully");
      }
    }
    return response.notFoundError(res, "Task not found");
  } catch (e) {
    console.error(e);
    response.errorResponse(res, "Internal server error");
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
