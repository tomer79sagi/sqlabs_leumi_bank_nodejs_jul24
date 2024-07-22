const express = require('express');

// Import all route handlers
const customerRoutes = require('./customerRoutes');

// 1. Set up the server
const app = express();
const port = 3000;

// PRE-HANDLER MIDDLEWARE
app.use(express.json());

// Delegate routing for '/api/customers' starting endpoint
app.use('/api/customers', customerRoutes);

// 2. Set up the routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.send({message: 'Hello World!'});
});

// Example: /api/search?q=hello
app.get('/api/search', (req, res) => {
    const { q } = req.query;

    // Iterate over all keys in a JS object
    for (let key in req.query) {
        console.log(key, req.query[key]);
    }

    // Perform search

    res.send({'search': q});
});

// POST-HANDLER MIDDLEWARE

// 3. Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

