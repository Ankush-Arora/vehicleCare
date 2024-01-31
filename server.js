const app = require("./app");
const dbConnection = require("./config/Datebase")
const cloudinary=require("cloudinary");
const dotenv = require("dotenv")

// Handling uncaught Exveptions

process.on("uncaughtException", (err) => {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception `);
    process.exit(1);
});

dbConnection();

if(process.env.NODE_ENV!=="PRODUCTION")
{dotenv.config({ path: "config/Config.env" });}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
    
});
const server = app.listen(process.env.PORT, () => {
    console.log(`server is running on http://localhost:${process.env.PORT}`)
});



process.on("unhandledRejection", (err) => {
    console.log(`Error ${err.message}`);
    console.log(`Shutting down the server due to UnhandledRejection Exception`);
    server.close(() => {
        process.exit(1);
    });
});
