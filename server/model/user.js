const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    max: 255,
    min: 6,
  },
  email: {
    type: String,
    required: true,
    max: 255,
    min: 6,
  },
  password: {
    type: String,
    max: 1024,
    min: 6,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: "Admin",
  },
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "group",
    default: null,
  },
  profileImage: {
    type: String,
    default: "avatar.jpeg",
  },
  phoneNumber: {
    type: String,
    max: 1024,
    min: 6,
  },
  birthDate: {
    type: String,
    max: 1024,
    min: 6,
  },
});

module.exports = mongoose.model('user', userSchema)