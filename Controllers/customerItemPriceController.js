const CustomerItemPrice = require("../Models/customerItemPrice");
const response = require("../Utils/resHandler");
const asyncHandler = require("express-async-handler");

const getCIPs = asyncHandler(async (req, res) => {
  try {
    let data = await CustomerItemPrice.find();
    response.successResponse(
      res,
      data,
      "Customer Item Prices Fetched Successfully"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const getCIP = asyncHandler(async (req, res) => {
  try {
    let data = await CustomerItemPrice.findById(req.params.id);
    if (!data) {
      response.notFoundError(
        res,
        `Customer Item Price not found with id ${req.params.id}`
      );
      return;
    }
    response.successResponse(
      res,
      data,
      "Customer Item Price Fetched Successfully"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const createCIP = asyncHandler(async (req, res) => {
  try {
    const data = await CustomerItemPrice.create(req.body);
    response.successResponse(
      res,
      data,
      "Customer Item Price Created Successfully"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const updateCIP = asyncHandler(async (req, res) => {
  try {
    const updateFields = { ...req.body };
    const updatedCIP = await CustomerItemPrice.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );
    if (!updatedCIP) {
      response.notFoundError(res, "Customer Item Price not found");
      return;
    }
    response.successResponse(
      res,
      updatedCIP,
      "Customer Item Price Updated Successfully"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const deleteCIP = asyncHandler(async (req, res) => {
  try {
    const deletedCIP = await CustomerItemPrice.findByIdAndDelete(req.params.id);
    if (!deletedCIP) {
      response.notFoundError(res, "Customer Item Price not found");
      return;
    }
    response.successResponse(
      res,
      {},
      "Customer Item Price Deleted Successfully"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

module.exports = { getCIP, getCIPs, createCIP, updateCIP, deleteCIP };
