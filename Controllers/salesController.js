const Sale = require("../Models/salesModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

// Get all sales
const getAllSales = asynchandler(async (req, res) => {
  try {
    const sales = await Sale.find({ companyId: req.user.companyId });
    response.successResponse(res, sales, "Data Successfully fetched");
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Get a single sale by ID
const getSale = asynchandler(async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      response.successResponse(res, sale, "Sale found");
    } else {
      res.status(404);
      throw new Error("Sale not found");
    }
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Add a new sale
const addSale = asynchandler(async (req, res) => {
  try {
    // Extract sale data from request body
    const { customerId, itemId, quantity, rate, cgst, sgst, igst, total } =
      req.body;

    // Create new sale object
    const sale = new Sale({
      companyId: req.user.companyId,
      customerId,
      itemId,
      quantity,
      rate,
      cgst,
      sgst,
      igst,
      total,
    });

    // Save the sale to the database
    const createdSale = await sale.save();

    // Respond with success message and created sale details
    response.successResponse(res, createdSale, "Sale created successfully");
  } catch (error) {
    // Handle errors
    response.errorResponse(res, error.message);
  }
});

// Edit a sale by ID
const editSale = asynchandler(async (req, res) => {
  try {
    // Extract sale data from request body
    const { customerId, itemId, quantity, rate, cgst, sgst, igst, total } =
      req.body;

    // Find the sale by ID
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      // Update sale details
      sale.customerId = customerId;
      sale.itemId = itemId;
      sale.quantity = quantity;
      sale.rate = rate;
      sale.cgst = cgst;
      sale.sgst = sgst;
      sale.igst = igst;
      sale.total = total;

      // Save the updated sale
      const updatedSale = await sale.save();

      // Respond with success message and updated sale details
      response.successResponse(res, updatedSale, "Sale updated successfully");
    } else {
      res.status(404);
      throw new Error("Sale not found");
    }
  } catch (error) {
    // Handle errors
    response.errorResponse(res, error.message);
  }
});

// Delete a sale by ID
const deleteSale = asynchandler(async (req, res) => {
  try {
    // Find the sale by ID
    const sale = await Sale.findById(req.params.id);
    if (sale) {
      // Remove the sale from the database
      await sale.remove();
      // Respond with success message
      response.successResponse(res, null, "Sale deleted successfully");
    } else {
      res.status(404);
      throw new Error("Sale not found");
    }
  } catch (error) {
    // Handle errors
    response.errorResponse(res, error.message);
  }
});

module.exports = {
  getAllSales,
  getSale,
  addSale,
  editSale,
  deleteSale,
};
