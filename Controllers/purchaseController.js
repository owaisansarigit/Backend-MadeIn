const Purchase = require("../Models/purchaseModel");
const itemTransaction = require("../Models/itemTransactionModel");
const Warehouse = require("../Models/warehouseModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

// Get all purchases
const getAllPurchase = asynchandler(async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate("companyId")
      .populate("supplier")
      .populate({
        path: "items",
        populate: {
          path: "item",
          model: "Item",
        },
      });
    response.successResponse(res, purchases, "Data Successfully fetched");
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Get a single purchase by ID
const getPurchase = asynchandler(async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) {
      response.successResponse(res, purchase, "Purchase found");
    } else {
      res.status(404);
      throw new Error("Purchase not found");
    }
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Add a new purchase
const addPurchase = asynchandler(async (req, res) => {
  try {
    const {
      supplier,
      referenceNo,
      taxableAmount,
      rate,
      cgst,
      sgst,
      igst,
      total,
      transactionOwnedBy,
      transactionType,
      typeofActivity,
      location,
      docNo,
      docDate,
      docRefNo,
      items,
    } = req.body;

    const generateSerialNumber = async () => {
      const purchases = await Purchase.find({ companyId: req.user.companyId });

      let newSerialNo;
      if (purchases.length === 0) {
        newSerialNo = 1;
      } else {
        newSerialNo = purchases.length + 1;
      }
      return newSerialNo;
    };

    const serialNo = await generateSerialNumber();
    const purchase = new Purchase({
      companyId: req.user.companyId,
      serialNo,
      supplier,
      referenceNo,
      taxableAmount,
      rate,
      cgst,
      sgst,
      igst,
      total,
      items,
    });

    // its new for add item transaction
    for (const item1 of items) {
      const { item, quantity, itemCode } = item1;

      // Create data for item transaction
      const dataToSave = {
        companyId: req.user.companyId,
        itemId: item,
        transactionOwnedBy,
        docNo,
        docDate,
        docRefNo,
        transactionType,
        typeofActivity,
        quantity,
        location,
      };

      // Create item transaction
      const itemTransactions = await itemTransaction.create(dataToSave);

      // Update warehouse quantity
      const warehouse = await Warehouse.findById(location);
      const existingItem = warehouse.items.find(
        (e) => e.name.toString() === item.toString()
      );
      if (!existingItem) {
        const newItem = {
          name: item,
          itemCode,
          balanceStock: quantity,
          stockIn: [itemTransactions._id],
        };
        warehouse.items.push(newItem);
      } else {
        // If the item exists, update its quantity
        existingItem.balanceStock += parseInt(quantity);
        existingItem.stockIn.push(itemTransactions._id);
      }

      // Save the updated warehouse
      await warehouse.save();
    }

    const createdPurchase = await purchase.save();
    response.successResponse(
      res,
      createdPurchase,
      "Purchase and transaction created successfully"
    );
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Edit a purchase
const editPurchase = asynchandler(async (req, res) => {
  try {
    const {
      companyId,
      itemId,
      supplier,
      referenceNo,
      taxableAmount,
      cgst,
      sgst,
      igst,
      total,
    } = req.body;
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) {
      purchase.companyId = companyId;
      purchase.itemId = itemId;
      purchase.supplier = supplier;
      purchase.referenceNo = referenceNo;
      purchase.taxableAmount = taxableAmount;
      purchase.cgst = cgst;
      purchase.sgst = sgst;
      purchase.igst = igst;
      purchase.total = total;

      const updatedPurchase = await purchase.save();
      response.successResponse(
        res,
        updatedPurchase,
        "Purchase updated successfully"
      );
    } else {
      res.status(404);
      throw new Error("Purchase not found");
    }
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

// Delete a purchase
const deletePurchase = asynchandler(async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (purchase) {
      await purchase.remove();
      response.successResponse(res, null, "Purchase deleted successfully");
    } else {
      res.status(404);
      throw new Error("Purchase not found");
    }
  } catch (error) {
    response.errorResponse(res, error.message);
  }
});

module.exports = {
  getAllPurchase,
  getPurchase,
  addPurchase,
  editPurchase,
  deletePurchase,
};
