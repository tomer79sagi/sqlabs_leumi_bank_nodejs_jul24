const router = require('express').Router();
const Transaction = require('../models/transaction');
const User = require('../models/user');
const mongoose = require('mongoose');

// -- DASHBOARD --
router.get('/dashboard', (req, res) => {
    res.renderWithLayout('account/dashboard');
});


// -- TRANSACTIONS --
router.get('/transactions', async (req, res) => {
    if (res.locals.user.accounts && res.locals.user.accounts.length > 0) {
        const transactions = await Transaction.find({
            $or: [
                    { fromAccount: { $in: res.locals.user.accounts} },
                    { toAccount: { $in: res.locals.user.accounts} }
                ]
            }).exec();
        res.renderWithLayout('account/transactions', { transactions });
    } else {
        res.renderWithLayout('account/transactions', { transactions: null, error: "No accounts available." });
    }
    
});


// -- TRANSFER --
router.get('/transfer', async (req, res) => {
    const user = await User.findById(res.locals.user._id);
    res.renderWithLayout('account/transfer', { accounts: user.accounts });
});

router.post('/transfer', async (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;
    const fromAcc = res.locals.user.accounts.find(account => account.number === parseInt(fromAccount));
    const toAcc = res.locals.user.accounts.find(account => account.number === parseInt(toAccount));
    
    if (fromAcc.balance < amount) {
        return res.renderWithLayout('account/transfer', { error: 'Insufficient balance' });
    }

    try { 
        const transaction = new Transaction({
            fromAccount: fromAcc._id.toString(),
            toAccount: toAcc._id.toString(),
            amount: amount,
        });

        // Update account balances
        fromAcc.balance -= amount;
        toAcc.balance += amount;

        await transaction.save();

        res.redirect('account/transactions');
    } catch (err) {
        res.renderWithLayout('account/transfer', { error: err.message });
    }
});


// -- ACCOUNTS --
router.get('/accounts', async (req, res) => {
    res.renderWithLayout('account/accounts', { accounts: res.locals.user.accounts });
});

router.post('/accounts', async (req, res) => {
    const user = await User.findById(res.locals.user._id);
    user.accounts.push({
        number: req.body.accountNumber,
        balance: req.body.balance,
    });

    try {
        await user.save();
        res.renderWithLayout('account/accounts', {user: user});
    } catch (err) {
        res.renderWithLayout('account/accounts', { error: err.message });
    }
});

module.exports = router;