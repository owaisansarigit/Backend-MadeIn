const mongoose = require("mongoose");
const DimensionSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  dimension: { type: String, required: true },
  code: { type: String, required: true },
  count: { type: Number },
  status: { type: String },
  dimensionTransaction: [
    {
      value: { type: String },
      caption: { type: String },
      count: { type: String },
      status: { type: String },
    },
  ],
});
const Dimension = mongoose.model("Dimension", DimensionSchema);
module.exports = Dimension;
