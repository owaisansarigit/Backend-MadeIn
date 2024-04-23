const Warehouse = require("../Models/warehouseModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

const getWarehouses = asynchandler(async (req, res) => {
  console.log(1);
  try {
    let data = await Warehouse.find({ companyId: req.user.id });
    console.log(data);
    if (data) {
      return response.successResponse(res, data, "All Warehouses Fetched");
    }
  } catch (error) {
    response.errorResponse(res, "Internal Server Error");
  }
});
const getWarehouse = asynchandler(async (req, res) => {
  try {
    let data = await Warehouse.findById(req.params.id);
    if (data.companyId != req.user.id) {
      return response.errorResponse(
        res,
        "You are not autorized to add in this warehouse"
      );
    }
    if (data) {
      return response.successResponse(res, data, " Warehouse Fetched");
    }
  } catch (error) {
    response.errorResponse(res, "Internal Server Error");
  }
});
const createWarehouse = asynchandler(async (req, res) => {
  try {
    let dataToSave = {
      ...req.body,
      companyId: req.user.id,
    };
    let data = await Warehouse.create(dataToSave);
    if (data) {
      return response.successResponse(res, data, "data successfully saved");
    }
    return response.errorResponse(res, "Failed in save data");
  } catch (error) {
    return response.error(res, "Internal Server Error");
  }
});
const addItemInWarehouse = asynchandler(async (req, res) => {
  if (!req.body.itemId) {
    return response.errorResponse(res, "Item not recieved to add");
  }
  try {
    let dataToSave = { name: req.body.itemId };
    let data = await Warehouse.findById(req.params.id);
    if (data.companyId != req.user.id) {
      return response.errorResponse(
        res,
        "You are not autorized to add in this warehouse"
      );
    }
    data.items.push(dataToSave);
    let savedData = await data.save();
    if (savedData) {
      return response.successResponse(
        res,
        savedData,
        "Item Added in ware house"
      );
    }
    return response.errorResponse(res, "failed to Item Add in ware house");
  } catch (error) {
    return response.errorResponse(res, "internal server error");
  }
});
const stockTransfer = asynchandler(async (req, res) => {
  let { from, to, item, quantity, refrence } = req.body;
  try {
    let fromWarehouse = await Warehouse.findById(from);
    let toWarehouse = await Warehouse.findById(to);
    let fromData = {
      from: fromWarehouse,
      quantity,
      refrence,
    };
    let toData = {
      to: toWarehouse,
      quantity,
      refrence,
    };
  } catch (e) {
    return response.errorResponse(res, "Internal Server Error");
  }
});

module.exports = {
  getWarehouse,
  getWarehouses,
  createWarehouse,
  addItemInWarehouse,
  stockTransfer,
};
