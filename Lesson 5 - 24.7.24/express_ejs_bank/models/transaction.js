// -- MODEL CLASS --
// 1. Import 'mongoose'
const mongoose = require('mongoose');

// 2. Define schema
const TransactionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    fromAccount: { type: String, required: true },
    toAccount: { type: String, required: true },
    notes: { type: String }
});

// 3. Export model / schema
module.exports = mongoose.model('Transaction', TransactionSchema);