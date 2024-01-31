const express = require("express")
const app = express();
const cors=require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload=require("express-fileupload");
const path=require("path");


const service = require("./routes/ServiceRoute");
const user = require("./routes/UserRoute");
const workerDetails=require("./routes/WorkerDetailsRoute");
const bookedRoute=require("./routes/BookedRoute");
const queryRoute=require("./routes/QueryRoute");
const errorMiddleware = require("./middleware/Error");


app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileUpload());


app.use("/api/v1", service);
app.use("/api/v1", user);
app.use("/api/v1", workerDetails);
app.use("/api/v1", bookedRoute );
app.use("/api/v1", queryRoute );

app.use(express.static(path.join(__dirname,"./build")))

app.get("*",(req,resp)=>{
    resp.sendFile(path.join(__dirname,"./build/index.html"));
})

app.use(errorMiddleware);

module.exports = app;
