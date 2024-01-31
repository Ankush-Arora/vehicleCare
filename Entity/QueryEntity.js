const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
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
    message: {
        type: String,
    },
    queryStatus: {
        type: String,
        default:"NEW QUERY"
    },
    queryAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = new mongoose.model("Query",querySchema);