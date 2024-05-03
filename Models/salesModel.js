const mongoose = require("mongoose");

const SalesSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Item",
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  referenceNo: { type: String, required: true },
  taxableAmount: { type: Number, required: true },
  cgst: { type: Number },
  sgst: { type: Number },
  igst: { type: Number },
  total: { type: Number, required: true },
});

const Sales = mongoose.model("Sales", SalesSchema);

module.exports = Sales;
