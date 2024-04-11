const mongoose = require("mongoose");
const billOfMaterialSchema = new mongoose.Schema({
  assemblyCode: { type: String, required: true },
  assemblyName: { type: String, required: true },
  fromDate: { type: Date },
  toDate: { type: Date },
  revision: { type: Number },
  status: { type: String },
});
const billOfMaterial = mongoose.model("billOfMaterial", billOfMaterialSchema);
module.exports = billOfMaterial;
