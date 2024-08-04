require("dotenv").config();
const Company = require("../Models/companyModel");
const Warehouse = require("../Models/warehouseModel");
const User = require("../Models/usersModel");
const jwt = require("jsonwebtoken");
const response = require("../Utils/resHandler");
const bcrypt = require("bcrypt");
const asynchandler = require("express-async-handler");
const DocumentList = require("../Models/DocomentList");

const createCompany = asynchandler(async (req, res) => {
  const { gst, phoneNumber, email, password, proprieter, companyName } =
    req.body;
  const existingEmail = await Company.findOne({ email });
  const existingGst = await Company.findOne({ gst });
  const existingPhoneNumber = await Company.findOne({ phoneNumber });
  const existingCompanyName = await Company.findOne({ companyName });
  if (existingEmail) {
    return response.errorResponse(
      res,
      "Company with this email already exists"
    );
  }
  if (existingGst) {
    return response.errorResponse(res, "Company with this GST already exists");
  }
  if (existingCompanyName) {
    return response.errorResponse(res, "Company with this Name already exists");
  }
  if (existingPhoneNumber) {
    return response.errorResponse(
      res,
      "Company with this phone number already exists"
    );
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCompany = await Company.create({
      gst,
      phoneNumber,
      email,
      password: hashedPassword,
      proprieter,
      companyName,
    });
    await DocumentList.create({ companyId: newCompany._id, type: "purchase" });
    await DocumentList.create({ companyId: newCompany._id, type: "sales" });
    response.successResponse(res, newCompany, "Company created successfully");
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const login = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the email belongs to a company
    const company = await Company.findOne({ email });
    if (company) {
      const passwordMatch = await bcrypt.compare(password, company.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { companyId: company._id, userId: company._id, company: company },
          process.env.JWTSECRET,
          { expiresIn: "1d" }
        );
        return response.successResponse(
          res,
          { token, company: { ...company, isAdmin: true, myId: company._id } },
          "Company login successful"
        );
      }
    }

    const user = await User.findOne({ email }).populate("company");
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          {
            companyId: user.company._id,
            userId: user._id,
            company: user.company,
          },
          process.env.JWTSECRET,
          {
            expiresIn: "1d",
          }
        );
        return response.successResponse(
          res,
          {
            token,
            company: { ...user.company, isAdmin: false, myId: user._id },
          },
          "User login successful"
        );
      }
    }

    // If neither company nor user found or password didn't match, return error
    return response.errorResponse(res, "Invalid email or password");
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

const addLocation = asynchandler(async (req, res) => {
  const { name, code, location } = req.body;
  if (!name || !code || !location) {
    response.validationError(res, "Please Send Required Data");
    return;
  }
  try {
    const companyId = req.user.companyId;
    const newLocation = new Warehouse({
      companyId,
      name,
      code,
      location,
    });
    await newLocation.save();
    await Company.findByIdAndUpdate(
      companyId,
      { $push: { addresses: newLocation._id } },
      { new: true }
    );
    response.successResponse(res, newLocation, "Updated");
  } catch (error) {
    response.errorResponse(res, "Internal Server Error");
  }
});

const getlocations = asynchandler(async (req, res) => {
  try {
    let data = await Warehouse.find({ companyId: req.user.companyId })
      .populate("items.name")
      .populate("items.stockIn")
      .populate("items.stockOut");
    // .populate("items.stockTransfers");
    response.successResponse(res, data, "Locations Fetched");
  } catch (error) {
    response.errorResponse(res, "Locations Fetched failed");
  }
});

const getUsers = asynchandler(async (req, res) => {
  try {
    let users = await User.find({ company: req.user.company._id });
    response.successResponse(res, users, "Data Fetched Succesfully");
  } catch (error) {
    response.internalServerError(res, "internal server error");
  }
});

const createUser = asynchandler(async (req, res) => {
  try {
    let { username, name, password } = req.body;
    if (!username || !name || !password) {
      return response.validationError(res, "Please send required data");
    }

    // Check if a user with the same email already exists
    let existingUser = await User.findOne({ email: username });
    if (existingUser) {
      return response.validationError(
        res,
        "User with this email already exists"
      );
    }

    // Check if a company with the same email already exists
    let existingCompany = await Company.findOne({ email: username });
    if (existingCompany) {
      return response.validationError(
        res,
        "Company with this email already exists"
      );
    }

    // Attempt to find the company associated with the request user
    let company = await Company.findById(req.user.companyId);

    // If company doesn't exist, create a new one
    if (!company) {
      company = await Company.create({
        _id: req.user.companyId,
        name: "Default Company Name",
      });
    }

    // Now, proceed with creating the user
    const hashedPassword = await bcrypt.hash(password, 10);
    let dataForSave = {
      name,
      email: username,
      company: req.user.companyId,
      password: hashedPassword,
    };

    let newUser = await User.create(dataForSave);

    company.users.push(newUser._id);
    await company.save();

    response.successResponse(res, company, "User added");
  } catch (error) {
    console.log(error);
    response.internalServerError(res, "Internal Server Error");
  }
});

module.exports = {
  createCompany,
  login,
  addLocation,
  getlocations,
  getUsers,
  createUser,
};
