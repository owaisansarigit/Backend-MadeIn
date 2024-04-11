const BOM = require("../Models/billOfMaterial");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

let getBOM = asynchandler(async (req, res) => {
  try {
    let data = await BOM.findById(req.params.id);
    if (data) {
      return response.successResponse(res, data, "Data Fetched Sucessfully");
    }
    return response.notFoundError(
      res,
      `data not found with this id ${req.params.id}`
    );
  } catch (e) {
    response.errorResponse(res, "internal server error");
  }
});
let getBOMs = asynchandler(async (req, res) => {
  try {
    let data = await BOM.find();
    if (data) {
      return response.successResponse(res, data, "Data Fetched Successfully");
    }
    response.notFoundError(res, "Data not available");
  } catch (e) {
    response.errorResponse(res, "internal server error");
  }
});
let createBOM = asynchandler(async (req, res) => {
  try {
    let newBOM = await BOM.create(req.body);
    return response.successResponse(res, newBOM, "BOM Created Successfully");
  } catch (e) {
    return response.errorResponse(res, "Failed to create BOM");
  }
});

let updateBOM = asynchandler(async (req, res) => {
  try {
    const bomId = req.params.id;
    const updateFields = { ...req.body };

    const existingBOM = await BOM.findById(bomId);
    if (!existingBOM) {
      return response.notFoundError(res, `BOM not found with id ${bomId}`);
    }

    const updatedBOMData = { ...existingBOM.toObject(), ...updateFields };

    const updatedBOM = await BOM.findByIdAndUpdate(bomId, updatedBOMData, {
      new: true,
    });

    if (updatedBOM) {
      return response.successResponse(
        res,
        updatedBOM,
        "BOM Updated Successfully"
      );
    }

    return response.notFoundError(res, `BOM not found with id ${bomId}`);
  } catch (error) {
    return response.errorResponse(res, "Failed to update BOM");
  }
});

let deleteBOM = asynchandler(async (req, res) => {
  try {
    let deletedBOM = await BOM.findByIdAndDelete(req.params.id);
    if (deletedBOM) {
      return response.successResponse(res, null, "BOM Deleted Successfully");
    }
    return response.notFoundError(
      res,
      `BOM not found with id ${req.params.id}`
    );
  } catch (e) {
    return response.errorResponse(res, "Failed to delete BOM");
  }
});

module.exports = { getBOM, getBOMs, createBOM, updateBOM, deleteBOM };
