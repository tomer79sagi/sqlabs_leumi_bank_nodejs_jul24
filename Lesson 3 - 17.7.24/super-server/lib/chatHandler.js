const http = require('http');
const path = require('path');
const fs = require('fs');
const WebSocket = require('ws');


const chatHandler = server => {

    // -- 2. INITIALIZE THE WS SERVER --
    const wss = new WebSocket.Server({ server });

    // Handling Client Connections
    wss.on('connection', ws => {
        // A) In case of a message from a client
        ws.on('message', message => {
            console.log(`Received: ${message}`);

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        });

        // B) Send a 'connection' message
        console.log('Client connected');
        ws.send('Welcome the chat');
    });
}

module.exports = {chatHandler};