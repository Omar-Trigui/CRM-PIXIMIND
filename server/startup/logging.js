const winston = require("winston");
require("winston-mongodb");
module.exports = function () {
  process.on("uncaughtException", (ex) => {
    console.log("we got an uncaught Exception");
    winston.error(ex.message, ex);
  });
  winston.handleExceptions(
    new winston.transports.Console({colorize:true , prettyPrint : true}),
    new winston.transports.File({ filename: "uncaughtException.log" })
  );

  //logger
  winston.add(winston.transports.File, { filename: "logFile.log" });
  winston.add(winston.transports.MongoDB, { db: process.env.DBSTRING });
};
