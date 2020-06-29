const Company = require("../model/company");
const xslx = require("xlsx");
const path = require("path");
const jwt = require("jsonwebtoken");

exports.addCompany = (req, res, next) => {
  //name companyOwner contactOwner groupId industruy phoneNumber type city region postaleCode numberOfEmployees annualRevenue Description Linkedin

  var company = new Company(req.body);

  company
    .save()
    .then(() => {
      return res.status(201).json({
        status: 201,
        message: "company created!",
        contactID: company._id,
        contact: company,
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
exports.getContacts = (req, res, next) => {
  Company.find({ groupId: req.body.groupId })
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
exports.getTemplate = (req, res, next) => {
  let filePath = path.resolve("server/uploads/TemplateCompanies.xlsx");
  res.download(filePath);
};

exports.uploadContactSheet = (req, res, next) => {
  const file = req.file;
  if (file) {
    let filePath = "server/uploads/" + req.file.filename;
    let sheet = xslx.readFile(filePath);
    let list = sheet.SheetNames;
    let Contacts = xslx.utils.sheet_to_json(sheet.Sheets[list]);

    Contacts.forEach((row) => {
      var company = new Company({
        name: row.name,
        companyOwner: req.body.companyOwner,
        industry: row.industry,
        phoneNumber: row.phoneNumber,
        type: row.type,
        city: row.city,
        postaleCode: row.postaleCode,
        numberOfEmployees: row.numberOfEmployees,
        annualRevenue: row.annualRevenue,
        Description: row.Description,
        Linkedin: row.Linkedin,
        groupId: req.body.groupId,
        contactOwner: req.body.contactOwner,
      });

      company.save().catch((err) => {
        if (err) {
          res.status(404).json({
            status: 404,
            message: err,
          });
        }
      });
    });
    res.status(201).json({ status: 201, message: "Companies created!" });
  }
};
exports.ExportContact = (req, res, next) => {
  Company.find({ groupId: req.query.id })
    .then((contacts) => {
      var outputData = [];
      for (var i = 0; i < contacts.length; i++) {
        var input = contacts[i];
        outputData.push([
          input.name,
          input.industry,
          input.phoneNumber,
          input.type,
          input.city,
          input.postaleCode,
          input.numberOfEmployees,
          input.annualRevenue,
          input.Description,
          input.Linkedin,
        ]);
      }
      var book = xslx.utils.book_new();
      const sheet = xslx.utils.aoa_to_sheet([
        [
          "name",
          "industry",
          "phoneNumber",
          "type",
          "city",
          "postaleCode",
          "numberOfEmployees",
          "annualRevenue",
          "Description",
          "Linkedin",
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
exports.deleteContact = (req, res, next) => {
  Company.findByIdAndDelete(req.body.ContactID)
    .then((company) => {
      return res.status(201).json({
        status: 201,
        message: company,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err });
      }
    });
};
exports.getContactByID = (req, res, next) => {
  Company.findOne({ _id: req.body.ContactID })
    .then((contact) => res.status(200).json({ status: 200, contact: contact }))
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};
exports.companyNumber = (req, res) => {
  Company.find({ groupId: req.body.group_id })
    .then((company) => {
      return res.status(200).json({
        status: 201,
        message: "company founds!",
        result: company.length,
      });
    })
    .catch((err) => {
      if (err) {
        res.status(404).json({ status: 404, message: err.message });
      }
    });
};
exports.updateContact = (req, res, next) => {
  var contact = req.body;

  Company.findOneAndUpdate({ _id: req.body.contactID }, contact)
    .then(() => {
      Company.findOne({ _id: req.body.contactID })
        .then((foundedContact) =>
          res.status(204).json({ status: 200, contact: foundedContact })
        )
        .catch((error) =>
          res.status(404).json({ status: 404, message: error.message })
        );
    })
    .catch((error) =>
      res.status(404).json({ status: 404, message: error.message })
    );
};
