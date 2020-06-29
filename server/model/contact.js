const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
  //email firstName lastName jobTitle phoneNumber contactOwner leadStatus lifecycleStage
  email: {
    type: String,
    max: 255,
    min: 6,
  },
  firstName: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  lastName: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  jobTitle: {
    type: String,
    max: 1024,
    min: 6,
  },
  phoneNumber: {
    type: String,
    max: 1024,
    min: 6,
  },
  contactOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
  },
  leadStatus: {
    type: String,
    max: 1024,
    min: 6,
  },
  lifecycleStage: {
    type: String,
    max: 1024,
    min: 6,
  },
  tags: [
    {
      type: String,
    },
  ],
  photo: {
    type: String,
    max: 255,
    min: 6,
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("contact", contactSchema);
