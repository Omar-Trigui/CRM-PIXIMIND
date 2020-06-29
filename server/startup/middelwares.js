const cors = require("cors");
const express = require("express");
const passport = require("passport");
const morgan = require('morgan');
const helmet = require("helmet");
require("../config/passport-setup");
module.exports = function (app) {
  //Route middelwares
  app.use(cors());
  app.use(helmet());
  app.use(morgan('tiny'));
  app.use(express.json());
  app.use(passport.initialize());
  app.use(passport.session());
};
