const mongoose = require("mongoose");
const itemTransactionSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  transactionOwnedBy: { type: String },
  docNo: { type: String },
  docDate: { type: String },
  docRefNo: { type: String },
  transactionType: { type: String },
  typeofActivity: { type: String },
  itemCode: { type: String },
  quantity: { type: String },
  UOM: { type: String },
  location: { type: mongoose.SchemaTypes.ObjectId, ref: "Warehouse" },
  itemTracking: { type: String },
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
