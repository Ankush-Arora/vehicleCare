const ErrorHandler = require("../utils/ErrorHandler");

module.exports = (err, req, resp, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if (err.name === "CastError") {
        const message = `Resource not dound .Invalid :${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    resp.status(err.statusCode).json({ success: false, message: err.message, });

}