const http = require('http');
const url = require('url');

let messages = [];

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;

    if (pathname === '/api/messages' && method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(messages));
    } else if (pathname === '/api/messages' && method === 'POST') {
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
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3003;
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
