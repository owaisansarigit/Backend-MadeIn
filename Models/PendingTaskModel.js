const mongoose = require("mongoose");

const PendingTaskSchema = new mongoose.Schema({
  firstApproover: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  finalApproover: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  firstApproove: { type: Boolean, default: false },
  finalApproove: { type: Boolean, default: false },
  type: { type: String, required: true },
  endPoint: { type: String, required: true },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
});

const PendingTask = mongoose.model("PendingTask", PendingTaskSchema);

module.exports = PendingTask;
