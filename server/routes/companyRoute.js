const express = require("express");
const router = express.Router();
const CompanyController = require("../controller/companyController");
const verifyToken = require("../middleware/verifyToken");
const uploader = require("../middleware/upload");



router.get("/getTemplate", CompanyController.getTemplate);
router.get("/ExportContact", CompanyController.ExportContact);

router.post("/addCompany", verifyToken, CompanyController.addCompany);
router.post("/getContacts", verifyToken, CompanyController.getContacts);
router.post("/updateContact", verifyToken, CompanyController.updateContact);
router.post("/deleteContact", verifyToken, CompanyController.deleteContact);
router.post("/companyNumber", verifyToken, CompanyController.companyNumber);
router.post("/getContactByID", verifyToken, CompanyController.getContactByID);
router.post(
  "/uploadContactSheet",
  verifyToken,
  uploader.uploadExcel.single("myFile"),
  CompanyController.uploadContactSheet
);
module.exports = router;
