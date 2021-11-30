const moment = require("moment");
const chalk = require("chalk");

exports.controlPanelPage = (req, res) => {
    console.log("rendering controlpanel");
    res.render("controlpanel");
};

exports.debug = (...args) => {
    let now = moment();
    args = [
        chalk.blue(now.format("YYYY-MM-DD HH:mm:ss")),
        chalk.green(": ")
    ].concat(args);
    console.log(args.join(""));
};

exports.pad = (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

exports.multiDashboard = (req, res) => {
    console.log("rendering controlpanel");
    res.render("multiscreen");
};