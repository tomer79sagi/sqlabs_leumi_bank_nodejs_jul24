const path = require('path');

// This middleware accepts the 'layout' view name as an argument
const renderWithLayout = (layout) => {
    // Define and return a middleware function
    return (req, res, next) => {
        res.renderWithLayout = (view, params = {}) => {
            params.body = path.join(__dirname, '../views', view);
            res.render(layout, params);
        }
        next();
    }
}

module.exports = renderWithLayout;