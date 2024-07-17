let ws;

function connectWebSocket() {
    ws = new WebSocket('ws://localhost:3001');

    ws.onopen = () => {
        console.log('Connected to the server');
    };

    ws.onmessage = (event) => {
        const chat = document.getElementById('chat');
        const message = document.createElement('div');
        const reader = new FileReader();

        reader.onload = function() {
            message.textContent = reader.result;
            chat.appendChild(message);
        };
    
        if (event.data instanceof Blob) {
            reader.readAsText(event.data);
        } else {
            message.textContent = event.data;
            chat.appendChild(message);
        }
    };

    ws.onclose = () => {
        console.log('Disconnected from the server');
        setTimeout(connectWebSocket, 1000); // Try to reconnect after 1 second
    };
}

function sendMessage() {
    const input = document.getElementById('message');
    const message = input.value;

    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message);
        input.value = '';
    } else {
        console.log('WebSocket is not open. ReadyState: ' + ws.readyState);
    }
}

connectWebSocket();