const WebSocket = require('ws');

function setupWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', ws => {
        ws.on('message', message => {
            console.log(`Received: ${message}`);
            // Broadcast the message to all clients
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        ws.send('Welcome to the WebSocket server!');
    });
}

module.exports = { setupWebSocketServer };
