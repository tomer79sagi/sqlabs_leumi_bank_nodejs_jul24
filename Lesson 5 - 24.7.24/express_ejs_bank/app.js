// -- IMPORTS --
const express = require('express');
const bodyParser = require('body-parser');
const resLogger = require('./middlewares/response-logger');

// -- DB IMPORTS --
const mongoose = require('mongoose');
const Transaction = require('./models/transaction');

const app = express();
const port = 3000;


// -- MIDDELWARES --
// Use Template Engine for EJS
app.set('view engine', 'ejs');

// Define a public static folder
app.use(express.static('public'));

// Define a body parser for Forms
app.use(bodyParser.urlencoded({ extended: true }));

// Use ResponseLogger Middleware
app.use(resLogger);


// -- DATA / DB --
const user = {
    name: 'John Doe',
    accounts: [
        { number: '12345678', balance: 5000 },
        { number: '87654321', balance: 3000 }
    ]
};

// -- USE MONGODB --
// 1. Create connection string
const connectionString = 'mongodb+srv://tomer79sagi:uW0JaI6kRZfd0Ruw@cluster0.q4m7kxp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// 2. Connect to MongoDB
mongoose.connect(connectionString, { useNewUrlParser: true})
    .then(() => {
        console.log("MongoDB Connected Successfully!");
    })
    .catch(err => {
        console.log(`MongoDB Failed to Connect XXX: ${err.message}`);
    });

// const transactions = [];



// -- CONTROLLER -- MVC
app.get('/', (req, res) => {
    res.render('index', { user: user });
});

app.get('/transfer', (req, res) => {
    res.render('transfer', { user: user });
});

app.post('/transfer', (req, res) => {
    const fromAccount = user.accounts.find(account => account.number === req.body.fromAccount);
    const toAccount = user.accounts.find(account => account.number === req.body.toAccount);
    const amount = parseFloat(req.body.amount);

    if (fromAccount && toAccount && fromAccount !== toAccount && amount > 0 && fromAccount.balance >= amount) {
        fromAccount.balance -= amount;
        toAccount.balance += amount;

        transactions.push({
            date: new Date().toLocaleString(),
            amount: amount,
            from: fromAccount.number,
            to: toAccount.number
        });
    }

    res.redirect('/');
});

app.get('/transactions', (req, res) => {
    res.render('transactions', { transactions: transactions });
});

app.listen(port, () => {
    console.log(`Banking app listening at http://localhost:${port}`);
});