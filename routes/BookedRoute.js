const express = require("express");
const { isUserAuthenticated, authorizeRoles } = require("../middleware/Authentication");
const { bookedService, getAllUsersBookings, getAllLoggedInUsersBookings, updateBookingStatus, deleteBooking, cancelBookingByUser } = require("../controllers/BookedController");
const router = express.Router();

router.route("/bookNew/service").post(isUserAuthenticated,bookedService);
router.route("/getAllBookings/service").get(isUserAuthenticated,authorizeRoles("admin"),getAllUsersBookings);
router.route("/user/all/bookings").get(isUserAuthenticated,getAllLoggedInUsersBookings);
router.route("/update/booking/status/:id").put(isUserAuthenticated,authorizeRoles("admin"),updateBookingStatus);
router.route("/cancel/booking/:id").put(isUserAuthenticated,cancelBookingByUser);
router.route("/delete/booking/:id").delete(isUserAuthenticated,authorizeRoles("admin"),deleteBooking);

module.exports = router;