// 1. Import 'http' module
const http = require('http');

// 2. Create a server
const server = http.createServer((request, response) => {
    // 3. Create a default response
    response.end('Hello world');
});

// 4. Start the server
const PORT = 3005;
server.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});