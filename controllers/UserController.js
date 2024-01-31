const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const User = require("../Entity/UserEntity");
const sendToken = require("../utils/JwtToken")
const sendEmail = require("../utils/SendEmail")
const crypto = require("crypto");
// register user
exports.registerUser = CatchAsyncErrors(async (req, resp, next) => {
    const { name, email, password } = req.body;
    const checkEmailExist = await User.findOne({ email });
    if (checkEmailExist) return next(new ErrorHandler("User with this email already exist", 400));
    if (email.length > 30 || name.length > 25 ) return next(new ErrorHandler("Email must not greater than 30 characters", 400));
    if (name.length > 25 ) return next(new ErrorHandler("Name must not exceed 25  characters", 400));
    const user = await User.create({ name, email, password });
    // const token=user.getJwtToken();
    //  return resp.status(200).json({success:true,token}); or
    return sendToken(user, 200, resp);
})


// getAll Users admins
exports.getAllUsers = CatchAsyncErrors(async (req, resp, next) => {
    const { name, email, password } = req.body;

    const users = await User.find();

    return resp.status(201).json({ success: true, users });
})

// get single user details
exports.getSingleUser = CatchAsyncErrors(async (req, resp, next) => {
    const user = await User.findById(req.user.id);

    if (!user) {
        return next(new ErrorHandler("user not found", 404));
    }
    return resp.status(201).json({ success: true, user });
})


// user login
exports.loginUser = CatchAsyncErrors(async (req, resp, next) => {

    const { email, password } = req.body;
    if (!email || !password) return new ErrorHandler("Please enter email & password", 400);
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("User email does not exist", 401));

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401));
    return sendToken(user, 200, resp);
    //    return resp.status(200).json({success:true,token});
})

// user logout 
exports.logoutUser = CatchAsyncErrors(async (req, resp, next) => {

    resp.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    return resp.status(200).json({ success: true, message: "Logged Out successfully" });
})

//change password

exports.changePassword = CatchAsyncErrors(async (req, resp, next) => {

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400));
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("new Password & confirm password does not match"));
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, resp);
});

// update user name
exports.updateUserName = CatchAsyncErrors(async (req, resp, next) => {
    const updatedData = {
        name: req.body.name,
    };

    const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true, useFindAndModify: false });
    return resp.status(200).json({ success: true, message: "Name Updated successfully" });
})

// updateProfile
// exports.updateProfile = CatchAsyncErrors(async (req, resp, next) => {
//     const updatedData = {
//         name: req.body.name,
//         email: req.body.email,
//     };

//     const user = await User.findByIdAndUpdate(req.user.id, updatedData, { new: true, runValidators: true, useFindAndModify: false });
//     return resp.status(200).json({ success: true, message: "Profile Updated successfully" });
// })

//update user role by admin
exports.updateRole = CatchAsyncErrors(async (req, resp, next) => {
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id, updatedData, { new: true, runValidators: true, useFindAndModify: false });
    return resp.status(200).json({ success: true, message: ` ${user.name}'s Role Updated successfully` });
})

// delete user by admin

exports.deleteUser = CatchAsyncErrors(async (req, resp, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist ${req.params.id} id`, 400));
    }
    await user.deleteOne();
    return resp.status(200).json({ success: true, message: `User ${user.email} has been deleted` });
})

exports.forgetPassword = CatchAsyncErrors(async (req, resp, next) => {

    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Your reset password token is :- \n\n ${resetPasswordUrl} \n\n if you have not requested this please ignore it`
    // console.log('testing working properly till try');
    try {
        // console.log('test1')
        await sendEmail({
            email: user.email,
            subject: `GharCare Password Reset`,
            message,
        });
        //   console.log('test2')
        return resp.status(200).json({ success: true, message: `Email sent to ${user.email} successfully` });

    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        // console.log('Buddy error ayi hai');
        return next(new ErrorHandler(error.message, 500));
    }
});

exports.resetPassword = CatchAsyncErrors(async (req, res, next) => {

    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })

    if (!user) {
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 404));
    }

    if(req.body.password!==req.body.confirmPassword)
    {
        return next(new ErrorHandler("Password doesn't match", 400));
    }

    user.password=req.body.password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;
    await user.save();

    sendToken(user,200,res)

})