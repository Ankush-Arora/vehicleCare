const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");
const WorkerDetails = require("../Entity/WorkerDetailsEntity");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudniary = require('cloudinary');

// Adding worker details
exports.addWorkerDetails = CatchAsyncErrors(async (req, resp, next) => {
    const { name, phoneNumber, governmentId, profession,
         houseNumber,locality,city,country,state,pincode } = req.body;
    //   console.log(name," , ",phoneNumber," , ",governmentId," , ",profession );
    //   console.log(houseNumber," , ",locality," , ",city," , ",state," , ",country," , ",pincode );
        const address={
            houseNumber:houseNumber,
            locality:locality,
            country:country,
            state:state,
            city:city,
            pincode:pincode,
        }
     
      let images1 = [];
    if (typeof req.body.images === "string") {
        images1.push(req.body.images);
    }
    else {
        images1 = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images1.length; i++) {
        const result = await cloudniary.v2.uploader.upload(images1[i], { folder: "workers" });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    const images = imagesLinks;

    const worker = await WorkerDetails.create({ name, phoneNumber, governmentId, profession, images, address });

    return resp.status(201).json({ success: true, worker });
});

//get all workers
exports.getAllWorkersDetails = CatchAsyncErrors(async (req, resp, next) => {
    const workers = await WorkerDetails.find();
    return resp.status(200).json({ sucess: true, workers });
})

exports.updateWorkersDetails = CatchAsyncErrors(async (req, resp, next) => {

    let worker = await WorkerDetails.findById(req.params.id);

    if (!worker) {
        return next(new ErrorHandler("Worker details Not Found so not able to update", 404));
    }

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    //  console.log("testing two",images)

    if (images !== undefined) {
        for (let i = 0; i < worker.images.length; i++) {
            await cloudniary.v2.uploader.destroy(worker.images[i].public_id)
        }


        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudniary.v2.uploader.upload(images[i], { folder: "workers" });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }
        req.body.images = imagesLinks;
    }


    let updatedWorker = await WorkerDetails.findByIdAndUpdate(req.params.id, req.body);
    return resp.status(200).json({ success: true, updated: req.body })
})

//delete worker details

exports.deleteWorkerDetails = CatchAsyncErrors(async (req, resp, next) => {
    let workerDetail = await WorkerDetails.findById(req.params.id);

    if (!workerDetail)
        return next(new ErrorHandler("Worker Not Found so not able to delete", 404));

    for (let i = 0; i < workerDetail.images.length; i++) {
        await cloudniary.v2.uploader.destroy(workerDetail.images[i].public_id)
    }

    await workerDetail.deleteOne();
    return resp.status(200).json({ success: true, message: `Worker has been deleted` })
});