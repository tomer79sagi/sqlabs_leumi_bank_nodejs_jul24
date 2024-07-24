const router = require('express').Router();
const User = require('../models/user');

// Register
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    // 1. We will have 'req.body' available
    // 2. Create a new User mongoost objet
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            name: req.body.name
        });
    
        // 3. Save the user
        await user.save();

        // 4. Redirect to 'login'
        res.redirect('/auth/login');
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.render('register', {error: error.message});
    }
});

// Login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {

});

module.exports = router;