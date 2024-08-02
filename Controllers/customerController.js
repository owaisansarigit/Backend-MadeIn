const Customer = require("../Models/customerModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");
const validateCustomer = require("../Middlewares/customerValidate");

const getCustomers = asynchandler(async (req, res) => {
  try {
    let data = await Customer.find({ companyId: req.user.companyId }).populate(
      "companyId"
    );
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
    let newCustomer = {
      ...req.body,
      companyId: req.user.companyId,
    };
    const data = await Customer.create(newCustomer);
    if (data) {
      return response.successResponse(
        res,
        data,
        "Customer Created Successfully"
      );
    }
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const updateCustomer = asynchandler(async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (req.user.companyId != customer.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update dimensions for this customer"
      );
    }
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
const addContactPerson = asynchandler(async (req, res) => {
  const { name, phoneNumber, designation } = req.body;
  if (!name || !phoneNumber || !designation) {
    return response.validationError(res, "Please Send Proper Details");
  }
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return response.notFoundError(res, "Customer not found");
    }
    if (req.user.companyId != customer.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to add a contact for this customer"
      );
    }
    // Constructing the contact person object
    const newContactPerson = {
      name,
      phoneNumber,
      designation,
    };
    // Pushing the constructed object into the contactPersons array
    customer.contactPersons.push(newContactPerson);

    const saved = await customer.save();
    if (saved) {
      return response.successResponse(
        res,
        customer,
        "Contact person added successfully"
      );
    }
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});
const addAdress = asynchandler(async (req, res) => {
  const {
    label,
    warehouseCode,
    contactPerson,
    country,
    state,
    city,
    address1,
    address2,
    address3,
    landmark,
    ZIP,
    type,
  } = req.body;
  if (
    !label ||
    !warehouseCode ||
    !contactPerson ||
    !country ||
    !state ||
    !city ||
    !address1 ||
    !address2 ||
    !address3 ||
    !landmark ||
    !ZIP ||
    !type
  ) {
    return response.validationError(res, "Please Send Proper Details");
  }
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return response.notFoundError(res, "Customer not found");
    }
    if (req.user.companyId != customer.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to add a contact for this customer"
      );
    }
    customer.addresses.push({ ...req.body });
    const saved = await customer.save();
    if (saved) {
      return response.successResponse(
        res,
        customer,
        "Address added successfully"
      );
    }
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const deleteCustomer = asynchandler(async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (req.user.companyId != customer.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update dimensions for this customer"
      );
    }
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
  addContactPerson,
  addAdress,
  deleteCustomer,
};
