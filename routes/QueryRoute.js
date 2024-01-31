const express = require("express");
const { createQuery,getAllQueries,deleteQuery, updateQueryStatus } = require("../controllers/QueryController");
const { isUserAuthenticated } = require("../middleware/Authentication");
const router = express.Router();

router.route("/send/query").post(createQuery);
router.route("/getAll/queries").get(isUserAuthenticated,getAllQueries);
router.route("/delete/query/:id").delete(isUserAuthenticated,deleteQuery);
router.route("/update/query/status/:id").put(isUserAuthenticated,updateQueryStatus);
 
module.exports = router;