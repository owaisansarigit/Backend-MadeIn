const Joi = require("joi");
const response = require("../Utils/resHandler");
const customerValidationSchema = Joi.object({
  contactType: Joi.string().allow(""),
  companyName: Joi.string().allow(""),
  contactName: Joi.string().allow(""),
  designation: Joi.string().allow(""),
  mobile1: Joi.number().allow(""),
  mobile2: Joi.number().allow(""),
  landline: Joi.number().allow(""),
  email: Joi.string().email().allow(""),
  GST: Joi.string().allow(""),
  PAN: Joi.string().allow(""),
  country: Joi.string().allow(""),
  website: Joi.string().allow(""),
  state: Joi.string().allow(""),
  city: Joi.string().allow(""),
  ZIP: Joi.string().allow(""),
  address1: Joi.string().allow(""),
  address2: Joi.string().allow(""),
  address3: Joi.string().allow(""),
  code: Joi.string().allow(""),
  remark: Joi.string().allow(""),
});
const validateCustomer = (req, res, next) => {
  const { error } = customerValidationSchema.validate(req.body);
  if (error) {
    return response.validationError(res, error.details[0].message);
  }
  next();
};
module.exports = validateCustomer;
