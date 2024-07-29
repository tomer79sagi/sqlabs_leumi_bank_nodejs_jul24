// middleware/renderWithLayout.js
const path = require('path');

const renderWithLayout = (layoutPath) => {
    return (req, res, next) => {
        res.renderWithLayout = (view, options = {}) => {
            options.body = path.join(__dirname, '../views', view);
            res.render(layoutPath, options);
        };
        next();
    };
};

module.exports = renderWithLayout;