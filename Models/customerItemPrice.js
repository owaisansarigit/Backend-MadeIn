const mongoose = require("mongoose");

const customerItemPriceSchema = new mongoose.Schema({
  hsnCode: String,
  organization: String,
  type: String,
  item: String,
  customerPrice: Number,
  MRP: Number,
  standardSalesPrice: Number,
  standardBulkSalesPrice: Number,
  standardPurchasePrice: Number,
  minimumPrice: Number,
  discountPrice: Number,
  discountPercentage: Number,
  rentalFreeDays: Number,
  rentalPriceDays: Number,
  rentalDelayCharges: Number,
  applicableFromDate: Date,
  applicableToDate: Date,
  status: String,
  tax: Number,
});

const CustomerItemPrice = mongoose.model(
  "CustomerItemPrice",
  customerItemPriceSchema
);

module.exports = CustomerItemPrice;
