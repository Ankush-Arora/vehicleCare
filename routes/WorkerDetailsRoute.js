const express = require("express");
const { addWorkerDetails, getAllWorkersDetails, updateWorkersDetails, deleteWorkerDetails } = require("../controllers/WorkerDetailsController");
const { isUserAuthenticated, authorizeRoles } = require("../middleware/Authentication");
const router = express.Router();

router.route("/addWorker/details").post(isUserAuthenticated, authorizeRoles("admin"),addWorkerDetails);
router.route("/getAllWorkers").get(isUserAuthenticated, authorizeRoles("admin"),getAllWorkersDetails);
router.route("/update/workerDetails/:id").put(isUserAuthenticated, authorizeRoles("admin"),updateWorkersDetails);
router.route("/delete/worker/:id").delete(isUserAuthenticated, authorizeRoles("admin"),deleteWorkerDetails);

module.exports = router;