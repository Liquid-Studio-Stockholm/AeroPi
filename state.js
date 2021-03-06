var path = require("path");
const fs = require("fs");
//const defaultConfig = require("./default-config"); // default configs

loadConfigFromFile = fileName => {
    let result = true;
    var appDir = path.dirname(require.main.filename);
    let filePath = appDir + fileName;
    console.log("Reading sensorState from: ", filePath);
    try {
        if (fs.existsSync(filePath)) {
            console.log("Found .local-config.json");
            let rawdata = fs.readFileSync(filePath);
            let newConfig = JSON.parse(rawdata);
            result = newConfig;
        }
    } catch (err) {
        console.error(err);
        result = {};
    }

    return result;
};

//const localConfig = loadConfigFromFile("/.local-config.json");
const savedConfig = loadConfigFromFile("/.config.json");

module.exports = { ...savedConfig };
