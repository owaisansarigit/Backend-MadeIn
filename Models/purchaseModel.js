const mongoose = require("mongoose");

const PurchaseSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  itemId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Item" },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Item",
      },
      quantity: { type: Number },
      rate: { type: Number },
      taxableAmount: { type: Number, required: true },
    },
  ],
  serialNo: { type: Number, required: true },
  // quantity: { type: Number, required: true },
  // rate: { type: Number },
  referenceNo: { type: String, required: true },
  taxableAmount: { type: Number, required: true },
  cgst: { type: Number },
  sgst: { type: Number },
  igst: { type: Number },
  total: { type: Number, required: true },
});

const Purchase = mongoose.model("Purchase", PurchaseSchema);

module.exports = Purchase;
