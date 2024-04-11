const Items = require("../Models/itemsModel");
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
    let data = await Items.find();
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

const updatePricing = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }
    Object.assign(item.Pricing, req.body);
    await item.save();
    return response.successResponse(res, item, "Pricing updated successfully");
  } catch (error) {
    console.error(error);
    return response.internalServerError(res, "Internal server error");
  }
};

const updateInventory = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return response.notFoundError(res, "Item not found");
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
};

const updateVender = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }
    Object.assign(item.Vendor, req.body);
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
};

const updateDimension = async (req, res) => {
  try {
    const item = await Items.findById(req.params.id);
    if (!item) {
      return response.notFoundError(res, "Item not found");
    }
    Object.assign(item.Dimension, req.body);
    await item.save();
    return response.successResponse(
      res,
      item,
      "Inventory updated successfully"
    );
  } catch (error) {
    console.error(error);
    console.log(error);
    return response.internalServerError(res, "Internal server error");
  }
};
const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Items.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    const imageResult = await cloudinary.uploader.upload(req.file.path);
    const newImageUrl = imageResult.secure_url;
    item.image = newImageUrl;
    await item.save();
    fs.unlinkSync(req.file.path);
    return res
      .status(200)
      .json({ message: "Image updated successfully", imageUrl: newImageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteItem = asynchandler(async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Items.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return response.notFoundError(res, "Item not found");
    }
    response.successResponse(res, {}, "Item Deleted Successfully");
  } catch (error) {
    response.internalServerError(res, "Internal server error");
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
};
