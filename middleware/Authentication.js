const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncErrors = require("./CatchAsyncErrors");
const jwt = require("jsonwebtoken")
const User = require("../Entity/UserEntity")

exports.isUserAuthenticated = CatchAsyncErrors(async (req, resp, next) => {
    const { token } = req.cookies;
    // console.log("token from cookie = ",token);

    if (!token) {
        return next(new ErrorHandler("Please login first", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
     
    // console.log("JWT SECRET ",process.env.JWT_SECRET);

    
    req.user = await User.findById(decodedData.id);

    return next();
})

exports.authorizeRoles = (...roles) => {
    return (req, resp, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role: ${req.user.role} is not allowed to access this resource`, 403))
        }
        return next();
    }
}