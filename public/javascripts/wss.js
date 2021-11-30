//const ws = new WebSocket("wss://lobbysensor-ws.serveo.net");

console.log(ws_url);
console.log(ws_port);
console.log(window.location.hostname);


const ws = new WebSocket("ws://" + window.location.hostname + ":" + ws_port);

ws.onerror = function (err) {
    console.error("failed to make websocket connection");
    throw err;
};

ws.onopen = function () {
    console.log("connection established");
};

ws.onmessage = function (event) {
    div = document.getElementById("value");
    //console.log(event);
    data = event.data;
    if (
        (data.startsWith("[[") && data.endsWith("]]")) ||
        (data.startsWith("{{") && data.endsWith("}}"))
    ) {
        valueString = data.substring(2, data.length - 2);
        valuePairs = valueString.split(";");
        sum = 0;
        for (i = 0; i < valuePairs.length; i++) {
            console.log(valuePairs[i]);
            valuePairArr = valuePairs[i].split(":");

            if (valuePairArr[0] == "PT") {
                $("#aero_panel_temp").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "UT") {
                $("#aero_pump_temp").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "RT") {
                $("#aero_room_temp").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "PH") {
                $("#aero_panel_hum").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "UH") {
                $("#aero_pump_hum").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "RH") {
                $("#aero_room_hum").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "WLP") {
                $("#aero_water_level").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "WT") {
                $("#aero_water_temp").text(valuePairArr[1]);
            } else if (valuePairArr[0] == "PR") {
                $("#aero_pressure").text(valuePairArr[1]);
                $("#aero_pressure_bar").attr("value", valuePairArr[1]);
            } else if (valuePairArr[0] == "ST") {
                let prev_aero_state = aero_state;
                aero_state = valuePairArr[1];
                let state_changed = prev_aero_state == aero_state;
                if (state_changed) {
                    if (aero_state == 0) {
                        $("#aero_state").text("IDLE");
                        $("#aero_state_button").text("START");
                        if ($("#aero_state_bar").is(":visible")) {
                            $("#aero_state_bar").fadeOut();
                        }
                        if ($("#aero_pressure_bar").is(":visible")) {
                            $("#aero_pressure_bar").fadeOut();
                        }
                    } else if (aero_state == 1) {
                        $("#aero_state").text("PRIMING");
                        $("#aero_state_button").text("STOP");
                    } else if (aero_state == 2) {
                        $("#aero_state").text("MISTING");
                        $("#aero_state_button").text("STOP");
                        $("#aero_state_bar").fadeIn();
                    } else if (aero_state == 3) {
                        $("#aero_state").text("PAUSING");
                        $("#aero_state_button").text("STOP");
                    } else if (aero_state == 4) {
                        $("#aero_state").text("MIXING");
                        $("#aero_state_button").text("STOP");
                    }

                    if (aero_state != "0") {
                        $(".aero_toggle").prop("disabled", true);
                    } else {
                        $(".aero_toggle").prop("disabled", false);
                    }
                }
            } else if (valuePairArr[0] == "SL") {
                if (aero_state == 2 || aero_state == 3) {
                    $("#aero_state_bar").attr("value", valuePairArr[1]);
                }
            } else if (valuePairArr[0] == "PMP") {
                valuePairArr[1] == "1"
                    ? $("#aero_pump_state").text("ON")
                    : $("#aero_pump_state").text("OFF");
                $("[aero-id='SP']").attr(
                    "aero-data",
                    valuePairArr[1] == "1" ? "0" : "1"
                );
                $("[aero-id='SP']").text(
                    valuePairArr[1] == "1" ? "Turn off" : "Turn on"
                );
                $("[aero-id='SP']").prop("disabled", false);
            } else if (valuePairArr[0] == "MST") {
                valuePairArr[1] == "1"
                    ? $("#aero_misting_state").text("OPEN")
                    : $("#aero_misting_state").text("CLOSED");
                $("[aero-id='SM']").attr(
                    "aero-data",
                    valuePairArr[1] == "1" ? "0" : "1"
                );
                $("[aero-id='SM']").text(
                    valuePairArr[1] == "1" ? "Close" : "Open"
                );
                $(".aero_toggle").prop("disabled", false);
            } else if (valuePairArr[0] == "BP") {
                valuePairArr[1] == "1"
                    ? $("#aero_bypass_state").text("OPEN")
                    : $("#aero_bypass_state").text("CLOSED");
                $("[aero-id='SB']").attr(
                    "aero-data",
                    valuePairArr[1] == "1" ? "0" : "1"
                );
                $("[aero-id='SB']").text(
                    valuePairArr[1] == "1" ? "Close" : "Open"
                );
                $(".aero_toggle").prop("disabled", false);
            }
        }
    }
};
pad = (num, size) => {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
};

$(document).ready(function () {
    /*setTimeout(function() {
        settingsNoOfSensors = $("#settingsNoOfSensors").val();
        settingMaxValue = $("#settingMaxValue").val();
        settingsTimeInterval = $("#settingsTimeInterval").val();
        ws.send("<VS" + settingsNoOfSensors + ">");
        ws.send("<VI" + settingsTimeInterval + ">");
        ws.send("<VM" + settingMaxValue + ">");
    }, 2000);*/

    $("#btnUpdateSettings").click(() => {
        if (minPressure != $("#minPressure").val()) {
            minPressure = $("#minPressure").val();
            console.log("New value for minPressure: " + pad(minPressure, 3));
            ws.send("<CPL" + pad(minPressure, 3) + ">");
        }
        if (maxPressure != $("#maxPressure").val()) {
            maxPressure = $("#maxPressure").val();
            console.log("New value for maxPressure: " + pad(maxPressure, 3));
            ws.send("<CPH" + pad(maxPressure, 3) + ">");
        }
        if (waterEmptyDistance != $("#waterEmptyDistance").val()) {
            waterEmptyDistance = $("#waterEmptyDistance").val();
            console.log(
                "New value for waterEmptyDistance: " +
                pad(waterEmptyDistance, 2)
            );
            ws.send("<CWE" + pad(waterEmptyDistance, 2) + ">");
        }
        if (waterFullDistance != $("#waterFullDistance").val()) {
            waterFullDistance = $("#waterFullDistance").val();
            console.log(
                "New value for waterFullDistance: " + pad(waterFullDistance, 2)
            );
            ws.send("<CWF" + pad(waterFullDistance, 2) + ">");
        }
        if (mistingScheduleRunTime != $("#mistingScheduleRunTime").val()) {
            mistingScheduleRunTime = $("#mistingScheduleRunTime").val();
            console.log(
                "New value for mistingScheduleRunTime: " +
                pad(mistingScheduleRunTime, 4)
            );
            ws.send("<CSR" + pad(mistingScheduleRunTime, 4) + ">");
        }
        if (mistingSchedulePauseTime != $("#mistingSchedulePauseTime").val()) {
            mistingSchedulePauseTime = $("#mistingSchedulePauseTime").val();
            console.log(
                "New value for mistingSchedulePauseTime: " +
                pad(mistingSchedulePauseTime, 4)
            );
            ws.send("<CSP" + pad(mistingSchedulePauseTime, 4) + ">");
        }
    });

    $(".aero_toggle").click(function () {
        data = "<" + $(this).attr("aero-id") + $(this).attr("aero-data") + ">";
        console.log("sending: " + data);
        console.log(ws);
        $(this).prop("disabled", true);
        ws.send(data);
    });
    $("#btnSendCommand").click(function () {
        data = "<" + $("#txtCommand").val() + ">";
        console.log("sending command: " + data);
        ws.send(data);
    });

    $("#aero_state_button").click(() => {
        if (aero_state == "0") {
            ws.send("<RG>");
            $("#aero_pressure_bar").fadeIn();
        } else {
            ws.send("<RS>");
        }
    });
});
