const jwt = require('jsonwebtoken');
const User = require('../models/user');

// JWT authentication middleware
const authenticateJWT = async (req, res, next) => {
    const token = req.signedCookies.mybank_prep;
    
    // 1. Verify the JWT token exists
    if (!token) {
        console.log('Authenticating: No Token Provided!');
        return res.redirect('../auth/login');
    }

    // 2. Check the JWT token is valid
    try {
        const parsedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve and populate the 'user' object in the res.locals.user property
        const user = await User.findById(parsedToken);
        delete user.password;
        res.locals.user = user;
    } catch(err) {
        res.redirect('../auth/login', {error: err.message});
    } finally {
        next();
    }
};

module.exports = authenticateJWT;