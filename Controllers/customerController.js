const Customer = require("../Models/customerModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");
const validateCustomer = require("../Middlewares/customerValidate");

const getCustomers = asynchandler(async (req, res) => {
  try {
    let data = await Customer.find();
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    console.log(error);
    response.internalServerError(res, "Internal server error");
  }
});
const getCustomer = asynchandler(async (req, res) => {
  try {
    let data = await Customer.findById(req.params.id);
    if (!data) {
      response.notFoundError(
        res,
        `Data not found with this id ${req.params.id}`
      );
    }
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const createCustomer = asynchandler(async (req, res) => {
  try {
    const data = await Customer.create(req.body);
    response.successResponse(res, data, "Customer Created Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const updateCustomer = asynchandler(async (req, res) => {
  try {
    const updateFields = { ...req.body };
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
      }
    );
    if (!updatedCustomer) {
      return response.notFoundError(res, "Customer not found");
    }
    response.successResponse(
      res,
      updatedCustomer,
      "Customer Updated Successfully"
    );
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const deleteCustomer = asynchandler(async (req, res) => {
  try {
    const deletedCustomer = await Customer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) {
      return response.notFoundError(res, "Customer not found");
    }
    response.successResponse(res, {}, "Customer Deleted Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
module.exports = {
  getCustomer,
  getCustomers,
  createCustomer: [validateCustomer, createCustomer],
  updateCustomer,
  deleteCustomer,
};
