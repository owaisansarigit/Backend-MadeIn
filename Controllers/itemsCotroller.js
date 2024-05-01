const Items = require("../Models/itemsModel");
const HSN = require("../Models/HSNModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");
const ValidateItem = require("../Middlewares/itemValidate");
const cloudinary = require("../Utils/cloudinary");
const itemTransaction = require("../Models/itemTransactionModel");
const Warehouse = require("../Models/warehouseModel");
const StockTransfer = require("../Models/stockTransferModel");

const getItem = asynchandler(async (req, res) => {
  try {
    let data = await Items.findById(req.params.id);
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
const getItems = asynchandler(async (req, res) => {
  try {
    let data = await Items.find({ companyId: req.user.companyId }).populate(
      "companyId"
    );
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const createItem = asynchandler(async (req, res) => {
  try {
    var img = "URL";
    const existingItem = await Items.findOne({ itemCode: req.body.itemCode });
    if (existingItem) {
      return response.validationError(
        res,
        "Item with this itemCode already exists"
      );
    }
    if (req.file) {
      const imageResult = await cloudinary.uploader.upload(req.file.path);
      img = imageResult.secure_url;
    }
    const dataToSave = {
      companyId: req.user.companyId,
      itemCode: req.body.itemCode,
      itemName: req.body.itemName,
      category: req.body.category,
      subcategory: req.body.subcategory,
      brand: req.body.brand,
      primaryUOM: req.body.primaryUOM,
      secoundaryUOM: req.body.secoundaryUOM,
      HSNcode: req.body.HSNcode,
      tax: req.body.tax,
      typeOfItem: req.body.typeOfItem,
      BOMRef: req.body.BOMRef,
      Pricing: req.body.Pricing,
      inventory: req.body.inventory,
      image: img,
    };
    const data = await Items.create(dataToSave);
    response.successResponse(res, data, "Item Created Successfully");
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});
const updateItem = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const updateFields = { ...req.body };
    const existingItem = await Items.findById(itemId);
    if (!existingItem) {
      return response.notFoundError(res, "Item not found");
    }

    if (req.user.companyId != existingItem.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update this item"
      );
    }

    const updatedItemData = { ...existingItem.toObject(), ...updateFields };
    if (updatedItemData.itemCode) {
      const itemWithSameCode = await Items.findOne({
        itemCode: updatedItemData.itemCode,
        _id: { $ne: itemId },
      });
      if (itemWithSameCode) {
        return response.validationError(
          res,
          "Another item with this itemCode already exists"
        );
      }
    }
    delete updatedItemData._id;
    const updatedItem = await Items.findByIdAndUpdate(itemId, updatedItemData, {
      new: true,
    });

    response.successResponse(res, updatedItem, "Item Updated Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const updatePricing = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }
    if (req.user.companyId != item.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update pricing for this item"
      );
    }

    Object.assign(item.Pricing, req.body);
    await item.save();
    return response.successResponse(res, item, "Pricing updated successfully");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const updateInventory = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }

    // Check if the user's companyId matches the companyId of the item
    if (req.user.companyId != item.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update inventory for this item"
      );
    }

    Object.assign(item.inventory, req.body);
    await item.save();
    return response.successResponse(
      res,
      item,
      "Inventory updated successfully"
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const updateVender = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }

    // Check if the user's companyId matches the companyId of the item
    if (req.user.companyId != item.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update vendors for this item"
      );
    }

    Object.assign(item.Vendor, req.body);
    await item.save();
    return response.successResponse(res, item, "Vendors updated successfully");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const updateDimension = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }

    // Check if the user's companyId matches the companyId of the item
    if (req.user.companyId != item.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update dimensions for this item"
      );
    }

    Object.assign(item.Dimension, req.body);
    await item.save();
    return response.successResponse(
      res,
      item,
      "Dimensions updated successfully"
    );
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const updateImage = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const item = await Items.findById(itemId);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }

    // Check if the user's companyId matches the companyId of the item
    if (req.user.companyId != item.companyId) {
      return response.errorResponse(
        res,
        "You are not authorized to update image for this item"
      );
    }

    if (!req.file) {
      return response.validationError(res, "No image uploaded");
    }

    const imageResult = await cloudinary.uploader.upload(req.file.path);
    const newImageUrl = imageResult.secure_url;
    item.image = newImageUrl;
    await item.save();
    fs.unlinkSync(req.file.path);
    return response.successResponse(res, item, "Image updated successfully");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
});

const deleteItem = asynchandler(async (req, res) => {
  try {
    let item = await Items.findById(req.params.id);
    if (req.user.companyId == item.companyId) {
      const itemId = req.params.id;
      const deletedItem = await Items.findByIdAndDelete(itemId);
      if (!deletedItem) {
        return response.notFoundError(res, "Item not found");
      }
      response.successResponse(res, {}, "Item Deleted Successfully");
    } else {
      response.errorResponse(res, "This is not your item");
    }
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
// HSN Controller
const getHSN = asynchandler(async (req, res) => {
  try {
    let data = await HSN.find({ companyId: req.user.companyId }).populate(
      "companyId"
    );
    response.successResponse(res, data, "Data Fetched Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
  }
});
const createHSN = asynchandler(async (req, res) => {
  let { hsnCode, tax, igst, cgst, sgst, description } = req.body;
  if (!hsnCode || !tax || !description || !igst || !sgst || !cgst) {
    return response.validationError(
      res,
      "Cannot Add HSN without Proper details"
    );
  }
  try {
    let existingHSN = await HSN.findOne({
      HSNCode: hsnCode,
      companyId: req.user.companyId,
    });
    if (existingHSN) {
      return response.validationError(res, "HSN Code Already Exist !");
    }
    let dataToSave = {
      HSNCode: hsnCode,
      tax,
      igst,
      sgst,
      cgst,
      description,
      companyId: req.user.companyId,
    };
    const data = await HSN.create(dataToSave);
    if (data) {
      return response.successResponse(res, "HSN Added Successfully !");
    }
    if (!data) {
      return response.errorResponse(res, "HSN Add Failed !");
    }
  } catch (e) {
    response.errorResponse(res, "Internal Server Error");
  }
});
const addItemTracking = asynchandler(async (req, res) => {
  try {
    let {
      transactionOwnedBy,
      docNo,
      docDate,
      docRefNo,
      transactionType,
      typeofActivity,
      itemCode,
      itemId,
      quantity,
      UOM,
      location,
      itemTracking,
      trackingDetails,
    } = req.body;
    if (
      !transactionOwnedBy ||
      !docNo ||
      !docDate ||
      !docRefNo ||
      !transactionType ||
      !itemCode ||
      !itemId ||
      !quantity ||
      !UOM ||
      !location ||
      !itemTracking ||
      !trackingDetails
    ) {
      response.validationError(res, "Please Send Required Data");
      return;
    }
    let existingTrackNos = new Set(
      (
        await itemTransaction
          .find({ companyId: req.user.companyId })
          .distinct("trackingDetails.trackNo")
      ).flat()
    );
    let newTrackingDetails = req.body.trackingDetails || [];
    for (let detail of newTrackingDetails) {
      if (existingTrackNos.has(detail.trackNo)) {
        response.validationError(res, "Duplicate trackNo found");
        return;
      }
    }
    let dataToSave = {
      ...req.body,
      companyId: req.user.companyId,
      itemId: itemId,
    };
    const newItemTransaction = await itemTransaction.create(dataToSave);
    if (
      transactionType === "purchase" ||
      transactionType === "samplein" ||
      transactionType === "adjust +ve"
    ) {
      const warehouse = await Warehouse.findById(req.params.id);
      const existingItemIndex = warehouse.items.findIndex(
        (item) => item.name.toString() === itemId
      );
      if (existingItemIndex === -1) {
        const newItem = {
          name: itemId,
          balanceStock: quantity,
          stockIn: [newItemTransaction._id],
        };
        warehouse.items.push(newItem);
      } else {
        const existingItem = warehouse.items[existingItemIndex];
        existingItem.balanceStock += parseInt(quantity);
        existingItem.stockIn.push(newItemTransaction._id);
      }
      await warehouse.save();
    }

    if (
      transactionType === "sales" ||
      transactionType === "adjust -ve" ||
      transactionType === "sampleout" ||
      transactionType === "lost" ||
      transactionType === "damaged"
    ) {
      const warehouse = await Warehouse.findById(req.params.id);
      const existingItemIndex = warehouse.items.findIndex(
        (item) => item.name.toString() === itemId
      );
      if (existingItemIndex === -1) {
        return response.errorResponse(res, "Item not found in warehouse");
      }
      const existingItem = warehouse.items[existingItemIndex];
      if (existingItem.balanceStock < quantity) {
        return response.errorResponse(res, "Not enough stock available");
      }
      existingItem.balanceStock =
        parseInt(existingItem.balanceStock) - parseInt(quantity);
      existingItem.stockOut.push(newItemTransaction._id);
      await warehouse.save();
    }
    if (newItemTransaction) {
      response.successResponse(res, "Transaction Added");
      return;
    }
  } catch (e) {
    response.internalServerError(res, "Internal Server Error");
    return;
  }
});
const getItemTransaction = asynchandler(async (req, res) => {
  try {
    let data = await itemTransaction
      .find({ itemId: req.params.id })
      .populate("companyId")
      .populate("itemId")
      .populate("location");
    response.successResponse(res, data, "Data Success fully Fetched");
  } catch (e) {
    response.internalServerError(res, "Internal Server Error");
  }
});
const getAllItemTransactions = asynchandler(async (req, res) => {
  try {
    let data = await itemTransaction
      .find({ companyId: req.user.companyId })
      .populate("companyId")
      .populate("location")
      .populate("itemId");
    response.successResponse(res, data, "Data Successfully Fetched");
  } catch (e) {
    response.internalServerError(res, "Internal Server Error");
  }
});
let checkTrackNo = asynchandler(async (req, res) => {
  try {
    // Check For Track No is not duplicate
    let existingTrackNos = new Set(
      (
        await itemTransaction
          .find({ companyId: req.user.companyId })
          .distinct("trackingDetails.trackNo")
      ).flat()
    );
    let newTrackingDetails = req.body || [];
    for (let detail of newTrackingDetails) {
      if (existingTrackNos.has(detail.trackNo)) {
        return response.validationError(
          res,
          `Duplicate trackNo ${detail.trackNo}`
        );
      } else {
        response.successResponse(res, "Ok");
      }
    }
  } catch (error) {
    response.internalServerError(res, "Internal Server Error");
  }
});
// Transfer Stock
const transferStock = async (req, res) => {
  try {
    const { fromLocation, toLocation, itemId, quantity } = req.body;
    if (!fromLocation || !toLocation || !itemId || !quantity) {
      response.errorResponse(res, "Please Send Required Field");
      return;
    }

    const fromWarehouse = await Warehouse.findById(fromLocation);
    const toWarehouse = await Warehouse.findById(toLocation);

    if (!fromWarehouse || !toWarehouse) {
      response.notFoundError(res, "One or both of the locations not found");
      return;
    }

    const itemInFromWarehouse = fromWarehouse.items.find(
      (item) => item.name.toString() === itemId
    );
    if (!itemInFromWarehouse || itemInFromWarehouse.balanceStock < quantity) {
      response.notFoundError(
        res,
        "Item not found in the source location or insufficient stock"
      );
      return;
    }

    let itemInToWarehouse = toWarehouse.items.find(
      (item) => item.name.toString() === itemId
    );

    if (!itemInToWarehouse) {
      // Item not found in destination, create new item entry
      itemInToWarehouse = {
        name: itemId,
        openingStock: 0,
        balanceStock: 0, // Initialize with 0 as it's a new item in destination
        stockIn: [],
        stockOut: [],
        stockTransfers: [],
      };
      toWarehouse.items.push(itemInToWarehouse);
    }

    itemInFromWarehouse.balanceStock -= parseInt(quantity);
    itemInToWarehouse.balanceStock += parseInt(quantity);

    // Save changes to both warehouses
    await fromWarehouse.save();
    await toWarehouse.save();

    const stockTransfer = new StockTransfer({
      fromLocation,
      toLocation,
      item: itemId,
      quantity,
      companyId: req.user.companyId,
    });

    await stockTransfer.save();

    // Update stock transactions
    itemInFromWarehouse.stockOut.push(stockTransfer._id);
    itemInToWarehouse.stockIn.push(stockTransfer._id);

    // Save changes to both warehouses again
    await fromWarehouse.save();
    await toWarehouse.save();

    response.successResponse(res, "Stock transferred successfully");
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
};

module.exports = {
  getItems,
  getItem,
  createItem: [ValidateItem, createItem],
  updateItem,
  updatePricing,
  updateInventory,
  updateVender,
  updateDimension,
  updateImage,
  deleteItem,
  getHSN,
  createHSN,
  addItemTracking,
  getItemTransaction,
  getAllItemTransactions,
  checkTrackNo,
  transferStock,
};
