const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const app = express();
const port = 3000;

const users = []; // This should be replaced with a database in a real application

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const secretKey = 'your-secret-key';

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token == null) return res.redirect('/login');

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.redirect('/login');
        req.user = user;
        next();
    });
};

app.get('/', authenticateToken, (req, res) => {
    res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(user => user.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
        const token = jwt.sign({ name: user.name, email: user.email }, secretKey);
        res.cookie('token', token, { httpOnly: true });
        // res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', signed: true });
        res.redirect('/');
    } else {
        res.send('Invalid email or password');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    users.push({ name, email, password: hashedPassword });
    res.redirect('/login');
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});