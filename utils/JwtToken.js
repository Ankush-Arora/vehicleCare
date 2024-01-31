//creating token and saving in cookie
// const cookie=require('cookie')
const sendToken = (user, statusCode, resp) => {
    const token = user.getJwtToken();

    if (!token) return resp.status(200).json({ success: false, message: "Session expired login again" })
    const options = {
         expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        // expires: new Date(Date.now() +15000),
        httpOnly: true,
        secure:true,
    };
    // console.log("token is in sendToken",token);
   
    return resp.status(statusCode).cookie("token", token, options).json({ success: true, user, token, });
}

module.exports = sendToken;