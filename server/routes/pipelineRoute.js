const express = require("express");
const router = express.Router();
const pipelineController = require("../controller/pipelineController");
const verifyToken = require("../middleware/verifyToken");
router.post("/addPipeline", verifyToken, pipelineController.addPipeline);
module.exports = router;