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
      stockIn: [
        {
          from: { type: String },
          quantity: { type: Number },
          refrence: { type: String },
        },
      ],
      stockOut: [
        {
          quantity: { type: Number },
          to: { type: String },
          refrence: { type: String },
        },
      ],
    },
  ],
});
const Warehouse = mongoose.model("Warehouse", warehouseSchema);

module.exports = Warehouse;
