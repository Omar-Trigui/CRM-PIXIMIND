const User = require("../model/user");
const { registerValidation, LoginValidation } = require("../validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TWO_HOURS = 1000 * 60 * 60 * 2;

//Register
async function register(req, res) {
  //Validation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking if the user is already in the database
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(405).send("email already exist");
  }
  //Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  //Create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashPassword,
    group: null,
  });
  try {
    const savedUser = await user.save();
    res.status(201).json({
      status: 201,
      id: savedUser._id,
      message: "user created!",
    });
  } catch (err) {
    res.status(400).send(err);
  }
}
exports.register = register;

//Login
async function login(req, res) {
  //Validation
  const { error } = LoginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //checking if the email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).send("User Not Found");
  }
  //Password is correct

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) {
    return res.status(400).send("Invalid Password");
  }
  //create and assign a token
  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: TWO_HOURS,
  });
  let expiresAt = TWO_HOURS + new Date().getTime();
  res.status(200).json({
    status: 200,
    userId: user._id,
    expiresAt: expiresAt,
    email: user.email,
    token: token,
    name: user.name,
    group: user.group,
    birthDate: user.birthDate,
    phoneNumber: user.phoneNumber,
    profileImage: user.profileImage,
    role: user.role,
  });
}
exports.login = login;

exports.handelGoogleAuth = (req, res, next) => {

  
  const currentUser = req.user;
  let expiresAt = TWO_HOURS + new Date().getTime();
  const accessToken = jwt.sign(
    {
      status: 200,
      _id: currentUser._id,
      role: currentUser.role,
      expiresAt: expiresAt,
      email: currentUser.email,
      name: currentUser.name,
      group: currentUser.group,
      profileImage: currentUser.profileImage,
      birthDate: currentUser.birthDate,
      phoneNumber: currentUser.phoneNumber,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: TWO_HOURS,
    }
  );

  res.redirect(
    `${process.env.REACT_APP_FRONTEND_URL}/callback?token=${accessToken}`
  );
};
async function updateUser(req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({ status: 404, message: "User Not Found" });
  }
  const file = req.file;
  //Hash the password
  var hashPassword;
  if (req.body.password == null) {
    hashPassword = user.password;
  } else {
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.password, salt);
  }

  var Newuser = {
    email: req.body.email,
    name: req.body.name,
    birthDate: req.body.birthDate,
    phoneNumber: req.body.number,
    password: hashPassword,
    contactID: req.body.contactID,
  };
  if (file) {
    Newuser.profileImage =
      process.env.REACT_APP_BACKEND_URL + "/" + req.file.filename;
  }

  User.findOneAndUpdate({ _id: req.body.contactID }, Newuser)
    .then(() => {
      User.findOne({ _id: req.body.contactID })
        .then((foundedUser) =>
          res.status(200).json({ status: 200, message: foundedUser })
        )
        .catch((error) =>
          res.status(404).json({ status: 404, message: error.message })
        );
    })
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
}
exports.updateUser = updateUser;
