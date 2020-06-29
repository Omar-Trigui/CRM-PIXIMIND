const express = require("express");
const router = express.Router();
const dealController = require('../controller/dealController.js');
const verifyToken = require("../middleware/verifyToken");
const ExceptionHandler = require("../middleware/ExceptionHandler")
router.post("/addDeal", verifyToken,ExceptionHandler(dealController.addDeal));
router.post(
  "/changeDealPosition",
  verifyToken,
  ExceptionHandler(dealController.changeDealPosition)
);
router.post(
  "/getDealsByGroupID",
  verifyToken,
  ExceptionHandler(dealController.getDealsByGroupID)
);

module.exports = router;