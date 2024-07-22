const express = require('express');
const router = express.Router();

// Example: /api/customers
router.get('/', (req, res) => {
    res.send({message: 'Get Customers'});
});

// Example: /api/customers
router.post('/', (req, res, next) => {
    // When using .json() middleware, I can treat .body as an object
    console.log(req.body);
    console.log(req.body.name);
    res.status(201).json({message: 'Create customer'});
});

// Example: /api/customers/:id
router.get('/:id', (req, res) => {
    const id = req.params.id;
    console.log('id:', id);

    res.send({name: `ID ${id}`});
});

router.get('/:id/transactions/:tran_id', (req, res) => {
    const {id, tran_id} = req.params;
    console.log('id:', id);
    console.log('tran_id:', tran_id);

    res.send({name: `ID ${id}`, tran_id: `Transaction ID ${tran_id}`});
});

module.exports = router;