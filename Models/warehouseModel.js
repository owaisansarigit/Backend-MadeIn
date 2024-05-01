const mongoose = require("mongoose");
const warehouseSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  name: { type: String },
  code: { type: String },
  location: { type: String },
  items: [
    {
      name: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
      openingStock: { type: Number },
      balanceStock: { type: Number },
      stockIn: [
        { type: mongoose.SchemaTypes.ObjectId, ref: "itemTransaction" },
      ],
      stockOut: [
        { type: mongoose.SchemaTypes.ObjectId, ref: "itemTransaction" },
      ],
      stockTransfers: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "StockTransfer",
        },
      ],
    },
  ],
});
const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
