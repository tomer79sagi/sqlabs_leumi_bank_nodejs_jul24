const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const User = require('../models/user');
const Transaction = require('../models/transaction');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

describe('Auth Controller', () => {
    let token;
    let userId;

    before(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await User.deleteMany({});
        await Transaction.deleteMany({});

        // Create a test user
        const user = new User({
            username: 'testuser',
            password: 'testpassword',
            accounts: [{
                accountNumber: '1234567890',
                balance: 1000
            }]
        });

        const savedUser = await user.save();
        userId = savedUser._id;

        // Generate JWT token for the test user
        token = jwt.sign({ _id: userId }, 'your_secret_key', { expiresIn: '1h' });
    });

    after(async () => {
        await Transaction.deleteMany({ $or: [{ fromAccount: userId }, { toAccount: userId }] });
        await User.deleteMany({});
        await mongoose.disconnect();
    });

    it('should render the dashboard', async () => {
        const res = await request(app)
            .get('/accounts/dashboard')
            .set('Cookie', `token=${token}`);

        expect(res.status).to.equal(200);
        expect(res.text).to.include('Dashboard');
    });

    it('should render transactions for an account', async () => {
        const res = await request(app)
            .get('/account/transactions')
            .set('Cookie', `token=${token}`);

        expect(res.status).to.equal(200);
        expect(res.text).to.include('Transactions');
    });

    it('should render transfer page with user accounts', async () => {
        const res = await request(app)
            .get('/account/transfer')
            .set('Cookie', `token=${token}`);

        expect(res.status).to.equal(200);
        expect(res.text).to.include('Transfer Funds');
        expect(res.text).to.include('1234567890');
    });

    it('should transfer funds between accounts', async () => {
        const user = await User.findById(userId);
        user.accounts.push({ accountNumber: '0987654321', balance: 500 });
        await user.save();

        const res = await request(app)
            .post('/account/transfer')
            .set('Cookie', `token=${token}`)
            .send({ fromAccount: user.accounts[0]._id, toAccount: user.accounts[1]._id, amount: 100 });

        expect(res.status).to.equal(302); // Redirect after successful transfer
        const updatedUser = await User.findById(userId);
        expect(updatedUser.accounts[0].balance).to.equal(900);
        expect(updatedUser.accounts[1].balance).to.equal(600);
    });

    it('should render accounts page with user accounts', async () => {
        const res = await request(app)
            .get('/account/accounts')
            .set('Cookie', `token=${token}`);

        expect(res.status).to.equal(200);
        expect(res.text).to.include('Accounts');
        expect(res.text).to.include('1234567890');
    });

    it('should add a new account', async () => {
        const res = await request(app)
            .post('/account/accounts')
            .set('Cookie', `token=${token}`)
            .send({ accountNumber: '111222333', balance: 300 });

        expect(res.status).to.equal(302); // Redirect after successful account creation
        const updatedUser = await User.findById(userId);
        expect(updatedUser.accounts.some(acc => acc.accountNumber === '111222333')).to.be.true;
    });
});
