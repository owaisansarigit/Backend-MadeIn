const ItemCat = require("../models/itemCategory");
const response = require("../Utils/resHandler");
const asynchandler = require("express-async-handler");

// Get all categories
const getCats = asynchandler(async (req, res) => {
  try {
    const data = await ItemCat.find();
    response.successResponse(res, data, "Categories Fetched Successfully");
  } catch (error) {
    response.errorResponse(res, error.message || "Failed to fetch categories");
  }
});

// Create a new category
const createCat = asynchandler(async (req, res) => {
  try {
    const { catName } = req.body;
    const newItemCat = new ItemCat({ catName });
    await newItemCat.save();
    response.successResponse(res, newItemCat, "Category Created Successfully");
  } catch (error) {
    response.errorResponse(res, error.message || "Failed to create category");
  }
});

// Update a category
const updateCat = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { catName } = req.body;
    const updatedCat = await ItemCat.findByIdAndUpdate(
      id,
      { catName },
      { new: true }
    );
    response.successResponse(res, updatedCat, "Category Updated Successfully");
  } catch (error) {
    response.errorResponse(res, error.message || "Failed to update category");
  }
});

// Add a subcategory to a category
const addSubCat = asynchandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { subCatName } = req.body;
    const updatedCat = await ItemCat.findByIdAndUpdate(
      id,
      { $push: { subCats: { subCatName } } },
      { new: true }
    );
    response.successResponse(res, updatedCat, "Subcategory Added Successfully");
  } catch (error) {
    response.errorResponse(res, error.message || "Failed to add subcategory");
  }
});

module.exports = { getCats, createCat, updateCat, addSubCat };
