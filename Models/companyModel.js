const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  gst: {
    type: String,
    required: true,
    unique: true,
    // validate: {
    //   validator: function (v) {
    //     return /^\d{2}[a-zA-Z]{5}\d{4}[a-zA-Z]{1}[a-zA-Z\d]{1}[a-zA-Z\d]{1}$/.test(
    //       v
    //     );
    //   },
    //   message: "GST must be in the format 23AEHPO1111D1ZE",
    // },
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  users: [
    {
      username: { type: String, required: true },
      name: { type: String, required: true },
      password: { type: String, required: true },
    },
  ],
  password: {
    type: String,
    required: true,
  },
  proprieter: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },
  ],
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
