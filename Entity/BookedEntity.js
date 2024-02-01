const mongoose = require("mongoose");

const bookedSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    serviceId: {
        type: String,
    },
    serviceName: {
        type: String,
        required: [true, "Please enter service name"],
        trim: true
    },
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true
    },
    vehicleName: {
        type: String,
        required: [true, "Please enter vehicle name"],
        trim: true
    },
    vehicleNumber: {
        type: String,
        required: [true, "Please enter vehicle number"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter email name"],
        trim: true
    },
    phoneNumber: {
        type: Number,
        required: [true, "Please enter service price"],
        minLength: [10, "Phone number must have atleast 10 digits"],
        maxLength: [10, "Phone number must be 10 digits"],
    },
    address: {
        houseNumber: {
            type: String,
            required: true
        },
        area: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    workDetails: {
        type: String,
    },
    bookingStatus: {
        type: String,
        default: "booked"
    },
    bookedAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = new mongoose.model("Booking",bookedSchema);