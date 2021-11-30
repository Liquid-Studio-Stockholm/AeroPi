const wss = require("./wss");
const common = require("./common");

var mockInterval = null;
var mockData = null;

var sensorArduino = null;
var controlArduino = null;

exports.init = () => {
    if (aeroState.arduinoAvailable) {
        var SerialPort = require("serialport");
        const Readline = require("@serialport/parser-readline");
        const parser1 = new Readline();
        const parser2 = new Readline();

        arduino1 = new SerialPort(
            aeroState.arduinoPath1,
            {
                baudRate: 115200,
                parser1
            },
            function(err) {
                if (err) {
                    console.log("Arduino error: ", err.message);
                } else {
                    console.log(
                        "Connected to Arduino at ",
                        aeroState.arduinoPath1
                    );
                    setTimeout(() => {
                        // sen config values to arduino

                        arduino1.write(
                            "<CWE" +
                                common.pad(aeroState.waterEmptyDistance, 2) +
                                ">"
                        );
                        arduino1.write(
                            "<CWF" +
                                common.pad(aeroState.waterFullDistance, 2) +
                                ">"
                        );
                        arduino1.write(
                            "<CPH" + common.pad(aeroState.maxPressure, 3) + ">"
                        );
                        arduino1.write(
                            "<CPL" + common.pad(aeroState.minPressure, 3) + ">"
                        );
                        arduino1.write(
                            "<CSR" +
                                common.pad(
                                    aeroState.mistingScheduleRunTime,
                                    4
                                ) +
                                ">"
                        );
                        arduino1.write(
                            "<CSP" +
                                common.pad(
                                    aeroState.mistingSchedulePauseTime,
                                    4
                                ) +
                                ">"
                        );
                        arduino1.write(
                            "<SS" + aeroState.arduinoSimulation + ">"
                        );
                    }, 2000);
                }
            }
        );
        arduino2 = new SerialPort(
            aeroState.arduinoPath2,
            {
                baudRate: 115200,
                parser2
            },
            function(err) {
                if (err) {
                    console.log("Arduino error: ", err.message);
                } else {
                    console.log(
                        "Connected to Arduino at ",
                        aeroState.arduinoPath2
                    );
                    setTimeout(() => {
                        // sen config values to arduino

                        arduino2.write(
                            "<CWE" +
                                common.pad(aeroState.waterEmptyDistance, 2) +
                                ">"
                        );
                        arduino2.write(
                            "<CWF" +
                                common.pad(aeroState.waterFullDistance, 2) +
                                ">"
                        );
                        arduino2.write(
                            "<CPH" + common.pad(aeroState.maxPressure, 3) + ">"
                        );
                        arduino2.write(
                            "<CPL" + common.pad(aeroState.minPressure, 3) + ">"
                        );
                        arduino2.write(
                            "<CSR" +
                                common.pad(
                                    aeroState.mistingScheduleRunTime,
                                    4
                                ) +
                                ">"
                        );
                        arduino2.write(
                            "<CSP" +
                                common.pad(
                                    aeroState.mistingSchedulePauseTime,
                                    4
                                ) +
                                ">"
                        );
                        arduino2.write(
                            "<SS" + aeroState.arduinoSimulation + ">"
                        );
                    }, 2000);
                }
            }
        );
        arduino1.pipe(parser1);
        arduino2.pipe(parser2);
        parser1.on("data", function(data) {
            console.log("incoming data from arduino1: " + data);
            arduino_data = data.trim();
            wss.sendToClients(arduino_data);
        });
        parser2.on("data", function(data) {
            console.log("incoming data from arduino2: " + data);
            arduino_data = data.trim();
            wss.sendToClients(arduino_data);
        });
    } else {
        console.log("No arduino available");
        arduino = {
            write: s => {}
        };
    }
};

exports.sendToArduino = data => {
    arduino1.write(data);
    arduino2.write(data);
};
