const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter service name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter service description"]
    },
    serviceAvailable: {
        type: Boolean,
        required: true
    },
    searchingNames: {
        type: String,
        required: [true, "Please enter search names"]
    },
    price: {
        type: Number,
        required: [true, "Please enter service price"],
        maxLength: [8, "Price cannot exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    tagline: {
        type: String,
        required: [true, "Please enter service category"],
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user:{
                    type:mongoose.Schema.ObjectId,
                    ref:"User",
                    required:true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = new mongoose.model("Service", serviceSchema);