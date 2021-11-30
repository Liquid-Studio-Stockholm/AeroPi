const WebSocket = require("ws");
const common = require("./common");
const arduino = require("./arduino");

// openning a websocket server

const wss = new WebSocket.Server({ port: aeroState.socketPort });

wss.on("listening", () => {
    console.log("WebSocket server started on ", aeroState.socketPort);
});

wss.on("connection", function(ws) {
    ws.on("message", function receiveMessage(message) {
        console.log(message);
        arduino1.write(message);
        arduino2.write(message);
        
    });
});

exports.sendToClients = data => {
    wss.clients.forEach(function(client) {
        //console.log("sending to", client);
        client.send(data);
    });
};
