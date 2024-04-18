const mongoose = require("mongoose");
const HSNSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  HSNCode: { type: String, required: true },
  tax: { type: Number, required: true },
  description: { type: String },
});
const HSN = mongoose.model("HSN", HSNSchema);

module.exports = HSN;
