const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Booked=require("../Entity/BookedEntity");


// Booking new Service
exports.bookedService=CatchAsyncErrors(async(req,resp,next)=>{
    let {user,serviceName,name,email,phoneNumber,workDetails,serviceId,vehicleNumber,vehicleName}=req.body;
    name=req.user.name;
    email=req.user.email;
    user=req.user._id;
    let address= {
        "houseNumber":req.body.houseNumber,
        "area":req.body.area,
        "country":req.body.country,
        "state":req.body.state,
        "city":req.body.city,
        "pincode":req.body.pincode
}
     
    if(!user || !serviceName || !email || !phoneNumber || !address || !vehicleNumber || !vehicleName){
        return next(new ErrorHandler("Please enter all fields",200));
    }

    const createBooking= await Booked.create({user,serviceId,serviceName,name,email,phoneNumber,address,workDetails,vehicleNumber,vehicleName});

    return resp.status(201).json({ success: true, createBooking });
})

// getting all booked services for all users

exports.getAllUsersBookings=CatchAsyncErrors(async(req,resp,next)=>{
    const allBooking=await Booked.find();
    //sort by dates
    const allBookings= allBooking.slice().sort((a,b)=> b.bookedAt-a.bookedAt);
    return resp.status(200).json({success:true,allBookings});
})

// get all orders for loggin user
exports.getAllLoggedInUsersBookings=CatchAsyncErrors(async(req,resp,next)=>{
    const user=req.user.id;
    // console.log("Logged in User Id = ",user);

    if(!user) {
        return next(new ErrorHandler("Some error occured incorrect user id",404));
    }
    const allBooking=await Booked.find({user});
    const allBookings= allBooking.slice().sort((a,b)=> b.bookedAt-a.bookedAt);
    return resp.status(200).json({success:true,allBookings});
})

exports.getAllLoggedInUsersBookings=CatchAsyncErrors(async(req,resp,next)=>{
    const user=req.user.id;
    // console.log("Logged in User Id = ",user);

    if(!user) {
        return next(new ErrorHandler("Some error occured incorrect user id",404));
    }
    const allBooking=await Booked.find({user});
    const allBookings= allBooking.slice().sort((a,b)=> b.bookedAt-a.bookedAt);
    return resp.status(200).json({success:true,allBookings});
})

// update booking status by admin only
exports.updateBookingStatus=CatchAsyncErrors(async(req,resp,next)=>{
    const {changeBookingStatus}=req.body;
    let booking=await Booked.findById(req.params.id);
    // console.log('Booking = ',booking)
    if(!booking){
        return next(new ErrorHandler("Booking not found",404));
    }
    booking.bookingStatus=changeBookingStatus;
    await booking.save();
    return resp.status(200).json({success:true,message:"status updated"});
})

// cancel booking status by user only
exports.cancelBookingByUser=CatchAsyncErrors(async(req,resp,next)=>{
    const {changeBookingStatus}=req.body;
    let booking=await Booked.findById(req.params.id);
    // console.log('Booking = ',booking)
    if(!booking){
        return next(new ErrorHandler("Booking not found",404));
    }
    booking.bookingStatus=changeBookingStatus;
    await booking.save();
    return resp.status(200).json({success:true,message:"booking cancelled"});
})

// delete booking by admin
exports.deleteBooking=CatchAsyncErrors(async(req,resp,next)=>{
    let booking=await Booked.findById(req.params.id);
    // console.log('Booking = ',booking)
    if(!booking){
        return next(new ErrorHandler("Booking not found",404));
    }
    await booking.deleteOne();
    return resp.status(200).json({success:true,message:"booking deleted successfully"});
})