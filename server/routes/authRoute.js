const express = require("express");
const router = express.Router();
const AuthController = require("../controller/authController");
const passport = require("passport");
const verifyToken = require("../middleware/verifyToken");
const uploader = require("../middleware/upload");
router.post("/login", AuthController.login);
router.post("/register", AuthController.register);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get(
  "/google/redirect",
  passport.authenticate("google"),
  AuthController.handelGoogleAuth
);

router.post(
  "/updateUser",
  uploader.uploadImage.single("myFile"),
  verifyToken,
  AuthController.updateUser
);


module.exports = router;
