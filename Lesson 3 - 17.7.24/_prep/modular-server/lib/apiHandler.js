let messages = [];

function handleApiRequest(pathname, method, req, res) {
    switch (`${pathname}-${method}`) {
        case '/api/messages-GET':
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(messages));
            break;

        case '/api/messages-POST':
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const message = JSON.parse(body);
                messages.push(message);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(message));
            });
            break;

        default:
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Not Found');
            break;
    }
}

module.exports = { handleApiRequest };
