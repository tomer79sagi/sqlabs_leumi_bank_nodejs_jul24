const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

// app.use(cookieParser()); // Regular cookies
app.use(cookieParser('your-secret-key')); // Use the cookie-parser middleware with a secret for signed cookies


// -- SESSION --
// app.use(session({
//     secret: 'secret-key',
//     resave: false,
//     saveUninitialized: true
// }));

app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false, // Don't save session if unmodified
    saveUninitialized: true, // Save uninitialized session
    cookie: {
        httpOnly: true, // Ensure the cookie is only sent over HTTP(S), not accessible via JavaScript
        secure: process.env.NODE_ENV === 'production', // Ensure the cookie is only sent over HTTPS in production
        maxAge: 3600000 // 1 hour
    }
}));

app.get('/', (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }
    res.send(`Number of views: ${req.session.views}`);
});


// -- COOKIES --
// Set a cookie
app.get('/set-cookie', (req, res) => {
    res.cookie('my-cookie', 'This is my cookie', {httpOnly: true});
    res.send('Cookie has been set');
});

// Get cookies
app.get('/get-cookie', (req, res) => {
    const cookies = req.cookies;
    res.send(cookies);
});

// Clear a cookie
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('my-cookie');
    res.send('Cookie has been cleared');
});


// -- SIGNED COOKIES --
// Set a signed cookie
app.get('/set-signed-cookie', (req, res) => {
    res.cookie('my-signed-cookie', 'This is my signed cookie', { signed: true });
    res.send('Signed cookie has been set');
});

// Get signed cookies
app.get('/get-signed-cookie', (req, res) => {
    const signedCookies = req.signedCookies;
    res.send(signedCookies);
});

// Clear a cookie
app.get('/clear-signed-cookie', (req, res) => {
    res.clearCookie('my-signed-cookie');
    res.send('Cookie has been cleared');
});

// Route to set a session value
app.get('/login', (req, res) => {
    req.session.user = { id: 1, name: 'John Doe' }; // Set session data
    res.send('Logged in and session set!');
});

// Route to get the session value
app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome ${req.session.user.name}`);
    } else {
        res.send('Please log in first');
    }
});

// Route to destroy the session
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Failed to log out');
        }
        res.send('Logged out and session destroyed!');
    });
});


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});