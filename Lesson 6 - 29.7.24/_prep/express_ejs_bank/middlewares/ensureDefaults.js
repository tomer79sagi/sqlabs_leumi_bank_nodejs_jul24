module.exports = (req, res, next) => {
    if (typeof res.locals.user === 'undefined') {
        res.locals.user = null;
    }

    if (typeof res.locals.error === 'undefined') {
        res.locals.error = null;
    }

    if (typeof res.locals.messages === 'undefined') {
        res.locals.messages = null;
    }

    next();
};