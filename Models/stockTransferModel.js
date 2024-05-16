const mongoose = require("mongoose");

const stockTransferSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  fromLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  toLocation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: true,
  },
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const StockTransfer = mongoose.model("StockTransfer", stockTransferSchema);

module.exports = StockTransfer;
