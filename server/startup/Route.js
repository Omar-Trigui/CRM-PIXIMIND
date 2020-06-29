module.exports = function (app) {
        
    //Importing route
    const authRoute = require("../routes/authRoute");
    const contacRoute = require("../routes/contactRoute");
    const groupRoute = require("../routes/groupRoute");
    const companyRoute = require("../routes/companyRoute");
    const pipeRoute = require("../routes/pipelineRoute");
    const dealRoute = require("../routes/dealRoute");
    //Routes
    app.use("/auth", authRoute);
    app.use("/api/contact", contacRoute);
    app.use("/api/group", groupRoute);
    app.use("/api/pipeRoute", pipeRoute);
    app.use("/api/company", companyRoute);
    app.use("/api/deal", dealRoute);
    app.get("/", (req, res) => res.send("Hello World!"));

}