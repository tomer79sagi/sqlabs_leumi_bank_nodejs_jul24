const skipLogin = (req, res, next) => {
    if (res.locals.user != null) {
        res.redirect('../accounts/dashboard');
    }

    next();
}

module.exports = skipLogin;