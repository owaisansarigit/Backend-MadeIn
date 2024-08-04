const DocumentList = require("../Models/DocomentList");
const asynchandler = require("express-async-handler");
const response = require("../Utils/resHandler");

let getDocuments = asynchandler(async (req, res) => {
  try {
    let companyId = req.user.companyId;
    let results = await DocumentList.find({ companyId }).populate("companyId");
    return response.successResponse(
      res,
      results,
      "DoccumentList fetched successful"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

let getDocument = asynchandler(async (req, res) => {
  try {
    let companyId = req.user.companyId;
    let type = req.params.type;
    let results = await DocumentList.findOne({ companyId, type }).populate(
      "companyId"
    );
    return response.successResponse(
      res,
      results,
      "DoccumentList fetched successful"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

// Update Document
let updateDocumentAprooval = asynchandler(async (req, res) => {
  try {
    let { isApproval, firstApproover, finalApproover } = req.body;
    let companyId = req.user.companyId;
    let document = await DocumentList.findById(req.params.id);
    document.isApproval = isApproval;
    if (isApproval) {
      document.firstApproover = firstApproover;
      document.finalApproover = finalApproover;
    }
    await document.save();
    return response.successResponse(
      res,
      document,
      "Doccument Update successful"
    );
  } catch (error) {
    console.error(error);
    response.internalServerError(res, "Internal server error");
  }
});

module.exports = { getDocuments, getDocument, updateDocumentAprooval };
