const { StatusCodes } = require("http-status-codes");
//const {CustomAPIError} = require("../errors");

const errorHandlerMiddleware = (err, req, res, next)=>{
    console.log(err);

    let customError = {
        // default
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'something went wrong please check and try again'
    }
    
    /* if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    } */
    if (err.name == 'CastError') {
        customError.msg = `No item found with id : ${err.value}`
        customError.statusCode = 404;                    
    }

    if (err.name == 'ValidationError') {
        customError.msg = Object.values(err.errors)
            .map((item)=>item.message)
            .join(', ');
        customError.statusCode = 400;                    
    }

    if (err.code && err.code == 11000) {
        customError.msg = `The mail: - ${err.keyValue.email} - is already existed please choose a different one.`
    }
    
    return res.status(customError.statusCode).json({msg: customError.msg});
    //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err});
}

module.exports = errorHandlerMiddleware