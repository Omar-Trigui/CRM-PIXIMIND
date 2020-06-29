const mongoose = require("mongoose");
const companySchema = new mongoose.Schema({
  //name owner industry phoneNumber type city region postaleCode numberOfEmployees annualRevenue Description Linkedin
  name: {
    type: String,
    max: 255,
    min: 6,
    required: true,
  },
  companyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contact",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
  contactOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  industry: {
    type: String,
    max: 255,
    min: 6,
  },
  phoneNumber: {
    type: String,
    max: 255,
    min: 6,
  },
  type: {
    type: String,
    max: 1024,
    min: 6,
  },
  city: {
    type: String,
    max: 1024,
    min: 6,
  },
  postaleCode: {
    type: String,
    max: 1024,
    min: 6,
  },
  numberOfEmployees: {
    type: String,
    max: 1024,
    min: 6,
  },

  annualRevenue: {
    type: String,
    max: 1024,
    min: 6,
  },
  Linkedin: {
    type: String,
    max: 1024,
    min: 6,
  },

  Description: {
    type: String,
    max: 1024,
    min: 6,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("company", companySchema);
