const mongoose = require("mongoose");
const itemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    required: true,
    unique: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  primaryUOM: {
    type: String,
    required: true,
  },
  secoundaryUOM: {
    type: String,
  },
  HSNcode: {
    type: Number,
  },
  tax: {
    type: Number,
    required: true,
  },
  typeOfItem: {
    type: String,
  },
  BOMRef: {
    type: String,
  },
  image: {
    type: String,
  },
  Pricing: {
    customerPrice: {
      type: Number,
    },
    MRP: {
      type: Number,
    },
    standardSalePrice: {
      type: Number,
    },
    standardBulkPrice: {
      type: Number,
    },
    standardPurchasePrice: {
      type: Number,
    },
    discountPercentage: {
      type: Number,
    },
    applicableFrom: {
      type: Date,
    },
    applicableTo: {
      type: Date,
    },
    status: {
      type: String,
    },
  },
  inventory: {
    openingStock: {
      type: Number,
    },
    closingStock: {
      type: Number,
    },
  },
  Vendor: {
    itemCode: { type: String },
    vendorOrganizationName: { type: String },
    venderItemCode: { type: String },
  },
  Dimension: {
    dimension: { type: String },
    dimensionTransaction: { type: String },
  },
});
const Item = mongoose.model("Item", itemSchema);

module.exports = Item;
