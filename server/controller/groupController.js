const Group = require("../model/group");
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const TWO_HOURS = 1000 * 60 * 60 * 2;
const transporter = require("../config/Mailer");

exports.createGroup = (req, res, next) => {
  const file = req.file;
  //create new book
  var group = new Group({
    name: req.body.name,
    website: req.body.website,
    members: req.body.members,
  });
  if (file) {
    group.photo = req.file.filename;
  }

  group
    .save()
    .then(() => {
      User.findByIdAndUpdate(
        { _id: req.body.members },
        {
          group: group._id,
        },
        function (err) {
          if (err) {
            console.log(" it was an error");
          } else {
            console.log(" group added to user");
          }
        }
      );
      return res.status(201).json({
        status: 201,
        message: "group created!",
        groupID: group._id,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({
          status: 404,
          message: err,
        });
      }
    });
};

exports.addUserToGroup = (req, res, next) => {
  Group.findByIdAndUpdate(
    { _id: req.body.groupID },
    {
      $push: {
        members: req.body.userID,
      },
    },
    function (err) {
      if (err) {
        res.status(404).json({ status: 404, message: err });
      } else {
        return res.status(201).json({
          status: 200,
          message: "member added!",
        });
      }
    }
  );
};
exports.getUsersByGroup = (req, res) => {
  User.find({ group: req.body.group_id }, "name _id email")
    .then((users) => res.status(200).json({ status: 200, users: users }))
    .catch((error) =>
      res.status(400).json({ status: 400, message: error.message })
    );
};
exports.getGroupById = (req, res) => {
  Group.findOne({ _id: req.body.groupId })
    .then((group) => res.status(200).json({ status: 200, group: group }))
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};
exports.editGroup = (req, res) => {

  const file = req.file;
  var newGroup = {
    name: req.body.name,
    website: req.body.website,
  };
  if (file) {
    newGroup.photo = file.filename;
  }


  Group.findOneAndUpdate({ _id: req.body.groupId }, newGroup)
    .then((group) => {
      Group.findOne({ _id: req.body.groupId })
        .then((user) => res.status(200).json({ status: 200, message: group }))
        .catch((error) =>
          res.status(404).json({ status: 404, message: error.message })
        );
    })
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};

async function inviteUsers(req, res) {

  let sender = req.body;
  const emailExist = await User.findOne({ email: sender.inviteUser });
  if (emailExist) {
    return res
      .status(404)
      .json({ status: 404, message: "email already exist" });
 
  }
  const user = new User({
    email: sender.inviteUser,
    role: "employee",
  });
  try {
    console.log(`"${sender.name}" <${sender.email}>`);
    const url = `${process.env.REACT_APP_FRONTEND_URL}/acceptInvitation/${sender.inviteUser}/${sender.group_id}`;
    let mailOptions = {
      from: `"${sender.name}" <${sender.email}>`, // sender address
      to: `${sender.inviteUser}`, // lisurlt of receivers
      subject: "Sub user Invitation", // Subject line
      html: `<a href=${url} >invitation</a>`, // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(404).json({ status: 404, message: error.message });
      } else {
        user.save();
        res.status(200).json({ status: 200, message: "sent" });
        console.log("Message sent: %s", info.messageId);
      }
    });
  } catch (error) {
    console.log("catch", error);
  }
}
exports.inviteUsers = inviteUsers;

async function acceptInvitation(req, res) {

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // add group id to user
  // add user id to group
  //update password
  User.findOneAndUpdate(
    { email: req.body.email },
    {
      group: req.body.group_id,
      password: hashPassword,
      name: req.body.full_name,
    }
  )
    .then((user) => {
      Group.findByIdAndUpdate(
        { _id: req.body.group_id },
        {
          $push: {
            members: user._id,
          },
        },
        async function (err) {
          if (err) {
            res.status(404).json({ status: 404, message: err });
          } else {
            const foundedUser = await User.findOne({ email: req.body.email });
            //create and assign a token
            const token = jwt.sign(
              { _id: user._id },
              process.env.TOKEN_SECRET,
              {
                expiresIn: TWO_HOURS,
              }
            );
            let expiresAt = TWO_HOURS + new Date().getTime();
            res.status(200).json({
              status: 200,
              userId: foundedUser._id,
              expiresAt: expiresAt,
              email: foundedUser.email,
              token: token,
              name: foundedUser.name,
              group: foundedUser.group,
              birthDate: foundedUser.birthDate,
              phoneNumber: foundedUser.phoneNumber,
              profileImage: foundedUser.profileImage,
              role: foundedUser.role,
            });
          }
        }
      );
    })
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );

}
exports.acceptInvitation = acceptInvitation;
