const router = require('express').Router();
const User = require('../models/user');


// Register
router.get('/register', (req, res) => {
    res.renderWithLayout('auth/register'); // Render with _layout
    // res.render('auth/register'); // Render without _layout
    // res.render('_layout', { body: 'auth/register' });
});

router.post('/register', async (req, res) => {
    // 1. We will have 'req.body' available
    // 2. Create a new User mongoost objet
    try {
        const { username, password, name } = req.body;

        const user = new User({
            username,
            password,
            name
        });
    
        // 3. Save the user
        await user.save();

        // 4. Redirect to 'login'
        res.redirect('login');
    } catch (error) {
        console.log(`Error: ${error.message}`);
        res.render('auth/register', {error: error.message});
    }
});

// Login
router.get('/login', async (req, res) => {
    res.render('auth/login');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.render('auth/login', { error: 'Username is not found' });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.render('auth/login', { error: 'Invalid password' });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', signed: true }).redirect('../accounts/dashboard');
});

router.post('/logout', (req, res) => {
    res.clearCookie('token').redirect('../auth/login');
});

module.exports = router;