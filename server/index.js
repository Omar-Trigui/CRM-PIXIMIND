require("dotenv").config();
const express = require("express");
const app = express();

require("./startup/middelwares")(app);
require("./startup/logging")();
require("./startup/mongo")();
require("./startup/Route")(app);

app.use(express.static(__dirname + "\\uploads"));
//listen to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Working on ${port}!`));
