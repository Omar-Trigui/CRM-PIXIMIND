const Contact = require("../model/contact");
const xslx = require("xlsx");
const path = require("path");
const jwt = require("jsonwebtoken");
const fs = require("fs");
exports.addContact = (req, res, next) => {



  var contact = new Contact({
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jobTitle: req.body.jobTitle,
    phoneNumber: req.body.phoneNumber,
    contactOwner: req.body.contactOwner,
    groupId: req.body.groupId,
    leadStatus: req.body.leadStatus,
    lifecycleStage: req.body.lifecycleStage,
    tags: req.body.tags.split(","),
  });
  const file = req.file;
  if (file) {
    contact.photo = req.file.filename;
  }

  contact
    .save()
    .then(() => {
      return res.status(201).json({
        status: 201,
        message: "contact created!",
        contactID: contact._id,
        contact: contact,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err });
      }
    });
};
exports.contactNumber = (req, res) => {
  Contact.find({ groupId: req.body.group_id })
    .then((contacts) => {
      return res.status(200).json({
        status: 201,
        message: "contacts founds!",
        result: contacts.length,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err.message });
      }
    });
};
exports.getContacts = (req, res, next) => {
  Contact.find({ groupId: req.body.group_id })
    .then((contacts) => {
      return res.status(200).json({
        status: 201,
        message: "contacts founds!",
        result: contacts,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err.message });
      }
    });
};
exports.deleteContact = (req, res, next) => {
  Contact.findByIdAndDelete(req.body.ContactID)
    .then(() => {
      return res.status(204).json({
        status: 201,
        message: "contacts deleted!",
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err });
      }
    });
};
exports.getContactByID = (req, res, next) => {
  Contact.findOne({ _id: req.body.ContactID })
    .then((contact) => res.status(200).json({ status: 200, contact: contact }))
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};

exports.updateContact = (req, res, next) => {
  

  var contact = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    jobTitle: req.body.jobTitle,
    phoneNumber: req.body.phoneNumber,
    contactOwner: req.body.contactOwner,
    groupId: req.body.groupId,
    leadStatus: req.body.leadStatus,
    lifecycleStage: req.body.lifecycleStage,
    tags: req.body.tags.split(","),
  };
  const file = req.file;
  if (file) {
    contact.photo = req.file.filename;
  }

  Contact.findOneAndUpdate({ _id: req.body.contactID }, contact)
    .then(() => {
      Contact.findOne({ _id: req.body.contactID })
        .then((foundedContact) =>
          res.status(204).json({ status: 200, contact: contact })
        )
        .catch((error) =>
          res.status(404).json({ status: 404, message: error.message })
        );
    })
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};

exports.uploadContactSheet = (req, res, next) => {
  const file = req.file;
  if (file) {
    let filePath = "server/uploads/" + req.file.filename;
    let sheet = xslx.readFile(filePath);
    let list = sheet.SheetNames;
    let Contacts = xslx.utils.sheet_to_json(sheet.Sheets[list]);

    Contacts.forEach((row) => {
      var contact = new Contact({
        email: row.email,
        firstName: row.firstName,
        lastName: row.lastName,
        jobTitle: row.jobTitle,
        phoneNumber: row.phoneNumber,
        contactOwner: req.body.contactOwner,
        groupId: req.body.groupId,
        leadStatus: row.leadStatus,
        lifecycleStage: row.lifecycleStage,
      });
      contact
        .save()
        .catch((error) =>
          res.status(400).json({ status: 400, message: error.message })
        );
    });
    res.status(201).json({ status: 201, message: "contacts created!" });
  }
};
exports.getTemplate = (req, res, next) => {
  let filePath = path.resolve("server/uploads/templateContact.xlsx");
  res.download(filePath);
};
exports.addLeadStatusOption = (req, res, next) => {
  fs.readFile(
    "server/uploads/leadStatus.json",
    "utf8",
    function readFileCallback(err, data) {
      if (err) {
        console.log(err);
      } else {
        let obj = JSON.parse(data); //now it an object
        obj.status.push(req.body.LeadStatus); //add some data
        let json = JSON.stringify(obj); //convert it back to json
        fs.writeFile("server/uploads/leadStatus.json", json, "utf8", (error) => {
          if (error) {
            console.log("Error writing file", error);
          } else {
            res
              .status(201)
              .json({ status: 201, message: "Successfully wrote file" });
          }
        }); // write it back
      }
    }
  );
};

exports.ExportContact = (req, res, next) => {
  Contact.find({ groupId: req.query.id })
    .then((contacts) => {
      var outputData = [];
      for (var i = 0; i < contacts.length; i++) {
        var input = contacts[i];
        outputData.push([
          input.email,
          input.firstName,
          input.lastName,
          input.jobTitle,
          input.phoneNumber,
          input.leadStatus,
          input.lifecycleStage,
        ]);
      }
      var book = xslx.utils.book_new();
      const sheet = xslx.utils.aoa_to_sheet([
        [
          "email",
          "firstName",
          "lastName",
          "jobTitle",
          "phoneNumber",
          "leadStatus",
          "lifecycleStage",
        ],
        ...outputData,
      ]);
      xslx.utils.book_append_sheet(book, sheet, "backup");
      let filePath = "server/uploads/" + Date.now() + "backup.xlsx";
      xslx.writeFile(book, filePath);

      const decodedToken = jwt.verify(
        req.query.accessToken,
        process.env.TOKEN_SECRET
      );

      const userId = decodedToken._id;

      if (req.query.userId && req.query.userId !== userId) {
        res.status(401).json({
          status: 401,
          error: new Error("Invalid request!"),
        });
      } else {
        res.download(filePath);
      }
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err.message });
      }
    });
};
