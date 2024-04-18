const Items = require("../Models/itemsModel");
const HSN = require("../Models/HSNModel");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");
const ValidateItem = require("../Middlewares/itemValidate");
const cloudinary = require("../Utils/cloudinary");

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
  let { hsnCode, tax, description } = req.body;
  if (!hsnCode || !tax || !description) {
    return response.validationError(
      res,
      "Cannot Add HSN without Proper details"
    );
  }
  try {
    // let existingHSN = await HSN.find({
    //   $and: [{ HSNCode: hsnCode }, { companyId: req.user.companyID }],
    // });
    // if (existingHSN) {
    //   return response.validationError(res, "HSN Code Already Exist !");
    // }
    let dataToSave = {
      HSNCode: hsnCode,
      tax,
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
};
