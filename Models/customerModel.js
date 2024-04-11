const mongoose = require("mongoose");
const customerSchema = new mongoose.Schema({
  contactType: { type: String },
  companyName: { type: String },
  contactName: { type: String },
  designation: { type: String },
  mobile1: { type: Number },
  mobile2: { type: Number },
  landline: { type: Number },
  email: { type: String },
  GST: { type: String },
  PAN: { type: String },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  ZIP: { type: String },
  address1: { type: String },
  address2: { type: String },
  address3: { type: String },
  code: { type: String },
  remark: { type: String },
});
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
