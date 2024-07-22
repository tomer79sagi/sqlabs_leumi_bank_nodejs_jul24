const express = require('express');

// Import all route handlers
const customerRoutes = require('./customerRoutes');
let logCounter = 1;

// 1. Set up the server
const app = express();
const port = 3000;

// PRE-HANDLER MIDDLEWARE
app.use(express.json());

// Custom middleware - LOGGING
app.use((req, res, next) => {
    console.log(`${logCounter++} | Method: ${req.method}`);
    next();
});

// Custom middleware - LOG RESPONSES - SEND & JSON
app.use((req, res, next) => {
    const oldSend = res.send;
    const oldJSON = res.json;

    res.send = function(body) {
        console.log(`Body: ${body}`);
        oldSend.call(this, body);
    }

    res.json = function(body) {
        console.log(`JSON Body: ${JSON.stringify(body)}`);
        oldJSON.call(this, body);
    }

    next();
});


// Delegate routing for '/api/customers' starting endpoint
app.use('/api/customers', customerRoutes);

// 2. Set up the routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api', (req, res) => {
    res.json({message: 'Hello World!'});
});

// Example: /api/search?q=hello
app.get('/api/search', (req, res, next) => {
    const { q } = req.query;

    // Iterate over all keys in a JS object
    for (let key in req.query) {
        console.log(key, req.query[key]);
    }

    // Perform search
    const error = new Error('Critical server error');
    error.status = 401;

    if (error) {
        next(error);
    } else {
        res.send({'search': q});
    }
});


// POST-HANDLER MIDDLEWARE

// Custom middleware - ERRORS
app.use((err, req, res, next) => {
    console.log(`Error: ${err.status} - ${err.message}`);
    res.status(err.status || 500).json({error: err.message});
});

// 3. Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

