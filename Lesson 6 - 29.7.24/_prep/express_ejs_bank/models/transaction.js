// -- MODEL CLASS --
// 1. Import 'mongoose'
const mongoose = require('mongoose');

// 2. Define schema
const TransactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User.accounts',
        required: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User.accounts',
        required: true
    },
    notes: { type: String }
});

// 3. Export model / schema
module.exports = mongoose.model('Transaction', TransactionSchema);