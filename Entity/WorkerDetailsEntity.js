const mongoose=require("mongoose");

const workerSchema=new mongoose.Schema({
    name: {
        type: String,
         required:true
    },
    phoneNumber: {
        type: Number,
         required:true
    },
    governmentId:{
        type: String,
         required:true
    },
    images:[{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    profession:{
        type:String,
        required:true
    },
    address:{
        houseNumber:{
            type:String,
            required:true
        },
        locality:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        pincode:{
            type:Number,
            required:true
        }
    }
})

module.exports=new mongoose.model("Worker",workerSchema);