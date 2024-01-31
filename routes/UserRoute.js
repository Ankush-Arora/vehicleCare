const express = require("express");
const { registerUser, getAllUsers, loginUser, logoutUser, changePassword, updateProfile, updateUserRole, updateRole, deleteUser, getSingleUser, updateUserName, forgetPassword, resetPassword } = require("../controllers/UserController");
const { isUserAuthenticated, authorizeRoles } = require("../middleware/Authentication");
// const sendMail = require("../utils/SendEmail");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/allUsers").get(isUserAuthenticated, authorizeRoles("admin"), getAllUsers);
router.route("/loggedin/user").get(isUserAuthenticated,getSingleUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router.route("/changePassword").post(isUserAuthenticated, changePassword);
// router.route("/updateProfile").put(isUserAuthenticated, updateProfile);
router.route("/update/userName").put(isUserAuthenticated, updateUserName);
router.route("/updateRole/:id").put(isUserAuthenticated, authorizeRoles("admin"), updateRole);
router.route("/deleteUser/:id").delete(isUserAuthenticated, authorizeRoles("admin"), deleteUser);
router.route("/forgot/password").post(forgetPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;