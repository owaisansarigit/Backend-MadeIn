const mongoose = require("mongoose");
const DocumentListSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  type: { type: String, required: true },
  isApproval: { type: Boolean, required: true, default: false },
  firstApproover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  finalApproover: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const DocumentList = mongoose.model("DocumentList", DocumentListSchema);

module.exports = DocumentList;
