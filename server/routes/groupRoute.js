const express = require("express");
const router = express.Router();
const GroupController = require("../controller/groupController");
const verifyToken = require("../middleware/verifyToken");
const uploader = require("../middleware/upload");

router.post(
  "/createGroup",
  uploader.uploadImage.single("myFile"),
  verifyToken,
  GroupController.createGroup
);
router.post(
  "/editGroup",
  uploader.uploadImage.single("myFile"),
  verifyToken,
  GroupController.editGroup
);
router.post("/addUserToGroup", verifyToken, GroupController.addUserToGroup);
router.post("/getUsersByGroup", verifyToken, GroupController.getUsersByGroup);
router.post("/getGroupById", verifyToken, GroupController.getGroupById);
router.post("/inviteUsers", verifyToken, GroupController.inviteUsers);
router.post("/acceptInvitation",  GroupController.acceptInvitation);

module.exports = router;
