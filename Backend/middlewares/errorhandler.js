const {CustomAPIError} = require('../errors');
const {StatusCodes} = require('http-status-codes');

const errorHandlerMiddleware = async(err, req, res, next)=> {
    if(err instanceof CustomAPIError){
        res.status(err.statusCode).json({msg: err.message});
    }

    if(err.code === 11000){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: `email ${err.keyValue.email} already exists`});
    }

    if(err.name = "ValidationError"){
        return res.status(StatusCodes.BAD_REQUEST).json({msg: err.message});
    }
    //res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg: "something went wrong please try again later."});
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

module.exports = errorHandlerMiddleware;