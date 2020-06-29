const winston = require("winston");
const mongoose = require("mongoose");
module.exports = function () {
  //Mongo DB connection
  mongoose.connect(
    process.env.DBSTRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    () => {
      winston.info("connected to db");
    }
  );
  mongoose.set("useFindAndModify", false);
};
