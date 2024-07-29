const router = require('express').Router();
const Transaction = require('../models/transaction');
const User = require('../models/user');

// -- DASHBOARD --
router.get('/dashboard', (req, res) => {
    res.renderWithLayout('account/dashboard');
});


// -- TRANSACTIONS --
router.get('/transactions', async (req, res) => {
    if (res.locals.user.accounts && res.locals.user.accounts.length > 0) {
        try {
            // 1. Search for user transactions
            const transactions = await Transaction.find({
                $or: [
                    { fromAccount: { $in: res.locals.user.accounts } },
                    { toAccount: { $in: res.locals.user.accounts }}
                ]
            }).exec();
    
            // 2. Return them if true
            res.renderWithLayout('account/transactions', { transactions });
            // transactions
        } catch(err) {
            // 3. If not, return null and error message
            res.renderWithLayout('account/transactions', { transactions: null, error: err.message });
        }
    } else { // 3. If not, return null and error message
        res.renderWithLayout('account/transactions', { transactions: null, error: "No accounts found for user" });
    }
});


// -- TRANSFER --
router.get('/transfer', async (req, res) => {
    const user = await User.findById(res.locals.user._id);
    res.renderWithLayout('account/transfer', { accounts: user.accounts });
});

router.post('/transfer', async (req, res) => {
    const { fromAccount, toAccount, amount } = req.body;

    const user = await User.findById(res.locals.user._id);
    const fromAcc = user.accounts.id(fromAccount);
    const toAcc = user.accounts.id(toAccount);

    if (!fromAcc || !toAcc) {
        return res.renderWithLayout('account/transfer', { error: 'Invalid account IDs' });
    }

    if (fromAcc.balance < amount) {
        return res.renderWithLayout('account/transfer', { error: 'Insufficient balance' });
    }

    const transaction = new Transaction({
        fromAccount,
        toAccount,
        amount,
    });

    try {
        // Update account balances
        fromAcc.balance -= amount;
        toAcc.balance += amount;

        await user.save();
        await transaction.save();

        res.redirect('account/transfer');
    } catch (err) {
        res.renderWithLayout('account/transfer', { error: err.message });
    }
});


// -- ACCOUNTS --
router.get('/accounts', async (req, res) => {
    res.renderWithLayout('account/accounts', { accounts: res.locals.user.accounts });
});

router.post('/accounts', async (req, res) => {
    const user = await User.findById(req.user._id);
    user.accounts.push({
        accountNumber: req.body.accountNumber,
        balance: req.body.balance,
    });

    try {
        await user.save();
        res.redirect('account/accounts');
    } catch (err) {
        res.renderWithLayout('account/accounts', { error: err.message });
    }
});

module.exports = router;