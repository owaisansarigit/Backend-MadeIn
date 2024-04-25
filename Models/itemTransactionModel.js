const mongoose = require("mongoose");
const itemTransactionSchema = new mongoose.Schema({
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
  transactionOwnedBy: {
    type: String,
    required: true,
  },
  docNo: {
    type: String,
    required: true,
  },
  docDate: {
    type: String,
    required: true,
  },
  docRefNo: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    required: true,
  },
  typeofActivity: {
    type: String,
    required: true,
  },
  itemCode: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
  UOM: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  itemTracking: {
    type: String,
    required: true,
  },
  trackingDetails: [
    {
      qty: { type: Number, required: true },
      trackNo: { type: String, required: true },
    },
  ],
});
const itemTransaction = mongoose.model(
  "itemTransaction",
  itemTransactionSchema
);
module.exports = itemTransaction;
