const express = require("express");
const router = express.Router();
const ContactController = require("../controller/contactController");
const verifyToken = require("../middleware/verifyToken");
const uploader = require("../middleware/upload");

router.post(
  "/addContact",
  verifyToken,
  uploader.uploadImage.single("myFile"),
  ContactController.addContact
);
router.post("/getContacts", verifyToken, ContactController.getContacts);
router.post(
  "/updateContact",
  verifyToken,
  uploader.uploadImage.single("myFile"),
  ContactController.updateContact
);
router.post("/deleteContact", verifyToken, ContactController.deleteContact);
router.post("/getContactByID", verifyToken, ContactController.getContactByID);
router.get("/getTemplate", ContactController.getTemplate);
router.post("/contactNumber", verifyToken, ContactController.contactNumber);
router.get("/ExportContact", ContactController.ExportContact);
router.post(
  "/addLeadStatusOption",
  verifyToken,
  ContactController.addLeadStatusOption
);
router.post(
  "/uploadContactSheet",
  verifyToken, 
  uploader.uploadExcel.single("myFile"),
  ContactController.uploadContactSheet
);

module.exports = router;
