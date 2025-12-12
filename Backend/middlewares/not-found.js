const {StatusCodes} = require('http-status-codes');

const notFound = (req, res) => {
    res.status(StatusCodes.NOT_FOUND).send('<h3>Route does not exist</h3>');
}

module.exports = notFound;