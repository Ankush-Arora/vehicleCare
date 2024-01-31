const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const Query=require("../Entity/QueryEntity");


// create query
exports.createQuery = CatchAsyncErrors(async (req, resp, next) => {
    const { name, email, phoneNumber,message } = req.body;
    
    const query = await Query.create({ name, email, phoneNumber,message });
    
    return  resp.status(200).json({success:true,message:"Message sent we will response soon!!"});
})

// getAll Users admins
exports.getAllQueries = CatchAsyncErrors(async (req, resp, next) => {

    const querie = await Query.find();
    const queries= querie.slice().sort((a,b)=> b.queryAt-a.queryAt);
    return resp.status(201).json({ success: true, queries });
})

// update query status
exports.updateQueryStatus=CatchAsyncErrors(async(req,resp,next)=>{
    const changeQueryStatus=req.body;
    let query=await Query.findById(req.params.id);

        //  console.log('updated status = ',changeQueryStatus.queryStatus);

    if(!query){
        return next(new ErrorHandler("Query not found",404));
    }
    query.queryStatus=changeQueryStatus.queryStatus;
    await query.save();
    return resp.status(200).json({success:true,message:"Query status updated"});
})

// delete query
exports.deleteQuery=CatchAsyncErrors(async(req,resp,next)=>{
    let query=await Query.findById(req.params.id);
    // console.log('Booking = ',booking)
    if(!query){
        return next(new ErrorHandler("Query not found",404));
    }
    await query.deleteOne();
    return resp.status(200).json({success:true,message:"query deleted successfully!!"});
})