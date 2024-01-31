const { json } = require("body-parser");
const Service = require("../Entity/ServiceEntity");
const CatchAsyncErrors = require("../middleware/CatchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const cloudniary = require('cloudinary');


//create service // only for admins
exports.createService = CatchAsyncErrors(async (req, resp) => {

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }

    const imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudniary.v2.uploader.upload(images[i], { folder: "services" });
        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url,
        })
    }

    req.body.images = imagesLinks;
    const service = await Service.create(req.body);
    return resp.status(201).json({ success: true, service })
}
);

//get all services
exports.getAllServices = CatchAsyncErrors(async (req, resp, next) => {
    const services = await Service.find();
    resp.status(200).json({ success: true, services, servicesCount: services.length })
});

//get service by id admin

exports.getServiceById = CatchAsyncErrors(async (req, resp, next) => {
    let service = await Service.findById(req.params.id);

    if (!service)
        return next(new ErrorHandler("Service Not Found", 404))

    return resp.status(200).json({ success: true, service })
});


//Upadate product for admins
exports.updateService = CatchAsyncErrors(async (req, resp, next) => {

    let service = await Service.findById(req.params.id);

    if (!service)
        return next(new ErrorHandler("Service Not Found so not able to update", 404));

    // console.log("testing one", req.body.images);

    let images = [];
    if (typeof req.body.images === "string") {
        images.push(req.body.images);
    }
    else {
        images = req.body.images;
    }
    //  console.log("testing two",images)

    if (images !== undefined) {
        for (let i = 0; i < service.images.length; i++) {
            await cloudniary.v2.uploader.destroy(service.images[i].public_id)
        }


        const imagesLinks = [];
        for (let i = 0; i < images.length; i++) {
            const result = await cloudniary.v2.uploader.upload(images[i], { folder: "services" });
            imagesLinks.push({
                public_id: result.public_id,
                url: result.secure_url,
            })
        }
        req.body.images = imagesLinks;
    }

    let updatedService = await Service.findByIdAndUpdate(req.params.id, req.body);
    return resp.status(200).json({ success: true, updated: req.body })
});

//delete service by id
exports.deleteService = CatchAsyncErrors(async (req, resp, next) => {
    let service = await Service.findById(req.params.id);

    if (!service)
        return next(new ErrorHandler("Service Not Found so not able to delete", 404));

    for (let i = 0; i < service.images.length; i++) {
        await cloudniary.v2.uploader.destroy(service.images[i].public_id)
    }

    await service.deleteOne();

    return resp.status(200).json({ success: true, message: "Service has been deleted" })
});

//Create new review and update the review

exports.createServiceReview = CatchAsyncErrors(async (req, resp, next) => {
    const { rating, comment, serviceId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    }

    const service = await Service.findById(serviceId);
        if(!service)
         return resp.status(200).json({ success: false, message: "Review not saved because service is currently unavailable" })

    const isReviewed = service.reviews.find(rev => rev.user.toString() === req.user._id.toString());

    if (isReviewed) {
        service.reviews.forEach((rev) => {
            if (rev.user.toString() === req.user._id.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        service.reviews.push(review);
        service.numOfReviews = service.reviews.length
    }

    let avg = 0;
    service.reviews.forEach(rev => {
        avg += rev.rating
    });

    service.ratings = (avg / service.reviews.length).toFixed(1);

    await service.save({ validateBeforeSave: false });

    return resp.status(200).json({ success: true, message: "Your review has been saved" })
})

//get all product review
exports.getServiceReviews = CatchAsyncErrors(async (req, resp, next) => {
    const service = await Service.findById(req.query.id);

    if (!service) {
        return next(new ErrorHandler("Service not found!", 404));
    }

    return resp.status(200).json({ success: true, overAllrating: service.ratings, allReviews: service.reviews });
})

// delete review
exports.deleteReview = CatchAsyncErrors(async (req, resp, next) => {
    const service = await Service.findById(req.query.serviceId);

    if (!service) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const reviews = service.reviews.filter((rev) => rev._id.toString() !== req.query.reviewId.toString());

    let avg = 0;

    reviews.forEach((rev) => {
        avg += rev.rating;
    });

    service.ratings = avg / service.reviews.length;
    const ratings = avg / reviews.length;
    const numOfReviews = reviews.length;

    await Service.findByIdAndUpdate(req.query.serviceId, {
        reviews, ratings, numOfReviews
    }, { new: true, runValidators: true, useFindAndModify: false })

    resp.status(200).json({ success: true })

})

