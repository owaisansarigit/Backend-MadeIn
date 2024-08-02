const itemTransaction = require("../Models/itemTransactionModel");
const Sale = require("../Models/salesModel");
const Warehouse = require("../Models/warehouseModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

// Get all sales
const getAllSales = asynchandler(async (req, res) => {
  try {
    const sales = await Sale.find({ companyId: req.user.companyId }).populate(
      "customer items.item"
    );
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

const addSale = asynchandler(async (req, res) => {
  try {
    const {
      customer,
      referenceNo,
      taxableAmount,
      quantity,
      rate,
      cgst,
      sgst,
      igst,
      total,
      docNo,
      docDate,
      docRefNo,
      items,
    } = req.body;

    const generateSerialNumber = async () => {
      const sales = await Sale.find({ companyId: req.user.companyId });

      let newSerialNo;
      if (sales.length === 0) {
        newSerialNo = 1;
      } else {
        newSerialNo = sales.length + 1;
      }
      return newSerialNo;
    };
    const serialNo = await generateSerialNumber();

    const sales = new Sale({
      companyId: req.user.companyId,
      serialNo,
      items,
      customer,
      referenceNo,
      quantity,
      taxableAmount,
      rate,
      cgst,
      sgst,
      igst,
      total,
      items,
    });

    for (const item1 of items) {
      const { item, quantity, trackingDetails, location } = item1;
      const warehouse = await Warehouse.findById(location);

      const existingItem = warehouse.items.find(
        (e) => e.name.toString() === item.toString()
      );
      if (!existingItem) {
        return response.errorResponse(res, "Item not found in warehouse");
      }
      if (quantity > existingItem.balanceStock) {
        return response.errorResponse(
          res,
          "Requested quantity exceeds available stock"
        );
      }

      const dataToSave = {
        companyId: req.user.companyId,
        itemId: item,
        transactionOwnedBy: "ME",
        docNo,
        docDate,
        docRefNo,
        transactionType: "sales",
        typeofActivity: "sales",
        quantity,
        location,
      };

      for (const trackNo of trackingDetails) {
        await itemTransaction.updateMany(
          { "trackingDetails.trackNo": trackNo },
          { $set: { "trackingDetails.$.available": false } }
        );
      }

      const itemTransactions = await itemTransaction.create(dataToSave);

      existingItem.balanceStock -= parseInt(quantity);
      existingItem.stockOut.push(itemTransactions._id);

      await warehouse.save();
    }

    const createdSales = await sales.save();
    response.successResponse(
      res,
      createdSales,
      "Sales and transaction created successfully"
    );
  } catch (error) {
    console.log(error);
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
      sale.customer = customerId;
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
