const fs = require('fs');
const path = require('path');

function serveStaticFile(urlPath, res) {
    const url = urlPath === '/' ? 'index.html' : urlPath;
    const filePath = path.join(__dirname, "../public", url);
    const fileExt = path.extname(filePath);

    const contentType = {
        ".css": "text/css",
        ".js": "application/javascript",
        ".json": "application/json",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".gif": "image/gif"
    }[fileExt] || "text/html";

    fs.readFile(filePath, (error, content) => {
        if (error != null) {
            if (error.code === 'ENOENT') {
                const errorFile = path.join(__dirname, "../public", "404.html");
                fs.readFile(errorFile, (err, data) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(data, 'utf8');
                });
            } else {
                res.writeHead(500);
                res.end(`Server error: ${error.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
}

module.exports = { serveStaticFile };
