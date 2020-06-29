const mongoose = require("mongoose");
const dealSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    required: true,
  },
  dealName: {
    type: String,
    max: 50,
    required: true,
  },
  dealAmount: {
    type: String,
    max: 50,
  },
  dealStage: {
    type: String,
    max: 50,
  },
  rate: {
    type: Number,
  },
  closeDate: {
    type: Date,
  },
  dealOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  companyID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "company",
    required: true,
  },
  contactID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "contact",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("deal", dealSchema);
