const mongoose = require("mongoose");
const dotenv = require('dotenv');
dotenv.config({ path: 'config/Config.env' })
// added %40 in place of @ into the password

const connectionToDatabase = () => {
    const DB = process.env.DB_URL;
    mongoose.connect(DB).then(() => {
        console.log('Connection successful in database')
    }).catch((err) => {
        console.log("Not connected to db some error occured", err);
    })
}

module.exports = connectionToDatabase;


