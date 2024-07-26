const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Company",
  },
  pendingTask: [],
  approovedTask: [],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
