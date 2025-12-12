const CustomApiError = require('./customAPIError');
const {StatusCodes} = require('http-status-codes');

class UnAuthenticatedError extends CustomApiError{
    constructor(msg){
        super(msg);
        this.statusCode = StatusCodes.UNAUTHORIZED;
    }
};

module.exports = UnAuthenticatedError;