const Joi = require("joi");
const response = require("../Utils/resHandler");

const itemValidationSchema = Joi.object({
  itemCode: Joi.string().required(),
  itemName: Joi.string().required(),
  category: Joi.string().required(),
  subcategory: Joi.string().required(),
  brand: Joi.string().required(),
  trackingType: Joi.string().required(),
  primaryUOM: Joi.string().required(),
  secoundaryUOM: Joi.string(),
  HSNcode: Joi.number(),
  tax: Joi.number().required(),
  typeOfItem: Joi.string(),
  BOMRef: Joi.string(),
  image: Joi.string().allow(""),
  Pricing: Joi.object({
    customerPrice: Joi.number(),
    MRP: Joi.number(),
    standardSalePrice: Joi.number(),
    standardBulkPrice: Joi.number(),
    standardPurchasePrice: Joi.number(),
    discountPercentage: Joi.number(),
    applicableFrom: Joi.date(),
    applicableTo: Joi.date(),
    status: Joi.string(),
  }),
  inventory: Joi.object({
    openingStock: Joi.number(),
    closingStock: Joi.number(),
  }),
});

const validateItem = (req, res, next) => {
  const { error } = itemValidationSchema.validate(req.body);
  if (error) {
    console.log(error.details);
    return response.validationError(res, error.details[0].message);
  }
  next();
};

module.exports = validateItem;
