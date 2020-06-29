const nodemailer = require("nodemailer");
const key = require("./keys");
//let testAccount = await nodemailer.createTestAccount();

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: key.google.email, // generated ethereal user
    pass: key.google.password, // generated ethereal password
  },
});



module.exports = transporter;