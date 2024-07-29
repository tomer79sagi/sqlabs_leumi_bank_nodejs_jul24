// Custom middleware - LOG RESPONSES - SEND & JSON
const responseLogger = (req, res, next) => {
    // const oldSend = res.send;
    // res.send = function(body) {
    //     console.log(`Body: ${body}`);
    //     oldSend.call(this, body);
    // }

    const oldJSON = res.json;
    res.json = function(body) {
        console.log(`JSON Body: ${JSON.stringify(body)}`);
        oldJSON.call(this, body);
    }

    next();
};

module.exports = responseLogger;