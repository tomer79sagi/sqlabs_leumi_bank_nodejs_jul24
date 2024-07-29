// -- IMPORTS --
const express = require('express');
const bodyParser = require('body-parser');

// -- CONTROLLER IMPORTS --
const accountController = require('./controllers/account');
const authController = require('./controllers/auth');
const ensureDefaults = require('./middlewares/ensureDefaults'); // Import the middleware
const resLogger = require('./middlewares/responseLogger');
const renderWithLayout = require('./middlewares/renderWithLayout');
const cookieParser = require('cookie-parser');
const authenticateJWT = require('./middlewares/auth');

// -- DB & CONFIG IMPORTS --
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = 3001;


// -- EJS TEMPLATING ENGINE --
app.set('view engine', 'ejs'); // Use Template Engine for EJS

// -- REQUEST MIDDLEWARES --
app.use(express.static('public')); // Define a public static folder
app.use(bodyParser.urlencoded({ extended: true })); // Define a body parser for Forms
app.use(cookieParser(process.env.COOKIE_SECRET));

// -- RESPONSE MIDDLEWARES --
app.use(resLogger); // Use ResponseLogger Middleware
app.use(ensureDefaults);
app.use(renderWithLayout('_layout'));

// -- DATA / DB / CONFIG --
// -- USE MONGODB --
// 1. Create connection string
const connectionString = process.env.MONGODB_URI || 'mongodb+srv://tomer79sagi:uW0JaI6kRZfd0Ruw@cluster0.q4m7kxp.mongodb.net/mybank?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(connectionString) // 2. Connect to MongoDB
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch(err => {
        console.log(`MongoDB Failed to Connect: ${err.message}`);
    });

// -- CONTROLLER -- MVC
app.get('/', (req, res) => res.redirect('auth/login'));
app.use('/accounts', [authenticateJWT], accountController);
app.use('/auth', authController);


app.listen(port, () => {
    console.log(`Banking app listening at http://localhost:${port}`);
});