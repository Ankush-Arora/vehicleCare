const express = require("express");
const { getAllServices, createService, updateService, deleteService, getServiceById, createServiceReview, getServiceReviews, deleteReview } = require("../controllers/ServiceController");
const { isUserAuthenticated, authorizeRoles } = require("../middleware/Authentication");

const router = express.Router();

router.route("/services").get(getAllServices);
router.route("/service/create").post(isUserAuthenticated, authorizeRoles("admin"), createService);
router.route("/service/update/:id").put(isUserAuthenticated, authorizeRoles("admin"), updateService);
router.route("/service/delete/:id").delete(isUserAuthenticated, authorizeRoles("admin"), deleteService);
router.route("/service/details/:id").get(getServiceById);
router.route("/service/review").put(isUserAuthenticated, createServiceReview);
router.route("/service/reviews").get(getServiceReviews).delete(isUserAuthenticated,deleteReview);
module.exports = router;