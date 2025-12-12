const CustomApiError = require('./customAPIError');
const {StatusCodes} = require('http-status-codes');

class BadRequestError extends CustomApiError{
    constructor(msg){
        super(msg);
        this.statusCode = StatusCodes.BAD_REQUEST;
    }
};

module.exports = BadRequestError;