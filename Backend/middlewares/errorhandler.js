const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = async(err, req, res, next)=> {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong please try again later."});
}

module.exports = errorHandlerMiddleware;