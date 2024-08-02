const jwt = require("jsonwebtoken");
const response = require("../Utils/resHandler");
require("dotenv").config();
const generateToken = (companyId) => {
  return jwt.sign({ companyId }, process.env.JWTSECRET, {
    expiresIn: "1d",
  });
};
const verifyToken = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return response.errorResponse(res, "Authorization token missing");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return response.errorResponse(res, "Invalid token");
  }
};
module.exports = {
  generateToken,
  verifyToken,
};
