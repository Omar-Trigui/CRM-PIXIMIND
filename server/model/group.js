const mongoose = require("mongoose");
const groupSchema = new mongoose.Schema({
  //name photo members 
  name: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  photo: {
    type: String,
    max: 255,
    min: 6,
  },
  website: {
    type: String,
    max: 255,
    min: 6,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  creationDate: {
    type: Date,
    default: Date.now,
  },
  
});

module.exports = mongoose.model("group", groupSchema);
