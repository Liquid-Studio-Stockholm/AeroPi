global.aeroState = require("./state");

const common = require("./common");
const arduino = require("./arduino");
const express = require("express");
const wss = require("./wss");
const path = require("path");
const router = require("./routes");
const app = express();
const parser = require("body-parser");

arduino.init();

app.use(parser.urlencoded({ extended: false }));
app.use(parser.json());

app.use("/", router);
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.resolve(__dirname, "public")));

app.listen(aeroState.port, function() {
    common.debug("listening on port " + aeroState.port);
});

setTimeout(() => {
    //common.initDevice();
}, 2000);

module.exports = app;
