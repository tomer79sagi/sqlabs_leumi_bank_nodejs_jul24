const auth = (req, res, next) => {
    console.log('Am I allowed?');
    next();
}

module.exports = auth;