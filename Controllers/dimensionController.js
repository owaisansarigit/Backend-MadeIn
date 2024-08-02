const Dimension = require("../Models/dimensionsModel");
const response = require("../Utils/resHandler");
const asyncHandler = require("express-async-handler");
const getAll = asyncHandler(async (req, res) => {
  try {
    let data = await Dimension.find({ companyId: req.user.companyId }).populate(
      "companyId"
    );
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const getDimension = asyncHandler(async (req, res) => {
  try {
    let data = await Dimension.findById(req.params.id).populate("companyId");
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const createDimension = asyncHandler(async (req, res) => {
  let { dimension, code, count, status } = req.body;
  if ((!dimension || !code || !count, !status)) {
    return response.validationError(
      res,
      "Cannot Add Dimension without Proper details"
    );
  }
  try {
    // let existingDimension = await Dimension.find({
    //   $and: [{ dimension: dimension }, { companyId: req.user.companyID }],
    // });
    // if (existingDimension) {
    //   return response.validationError(res, "Dimension Code Already Exist !");
    // }
    let dataToSave = {
      dimension: dimension,
      code,
      count,
      companyId: req.user.companyId,
    };
    const data = await Dimension.create(dataToSave);
    if (data) {
      return response.successResponse(res, "Dimension Added Successfully !");
    }
    if (!data) {
      return response.errorResponse(res, "Dimension Add Failed !");
    }
  } catch (e) {
    response.errorResponse(res, "Internal Server Error");
  }
});
const addDimensionTransaction = asyncHandler(async (req, res) => {
  const { value, caption, count, status } = req.body;
  try {
    const dimension = await Dimension.findById(req.params.id);
    if (!dimension) {
      return res.status(404).json({ message: "Dimension not found" });
    }
    dimension.dimensionTransaction.push({ value, caption, count, status });
    await dimension.save();
    res
      .status(201)
      .json({ message: "Transaction added successfully", dimension });
  } catch (error) {
    console.error("Error adding transaction:", error);
    res.status(500).json({ message: "Server Error" });
  }
});
module.exports = {
  getAll,
  getDimension,
  createDimension,
  addDimensionTransaction,
};
