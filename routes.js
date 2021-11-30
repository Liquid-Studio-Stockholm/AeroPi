const express = require("express");
const router = express.Router();
const common = require("./common");

router.route("/").get(common.controlPanelPage);
router.route("/multi").get(common.multiDashboard);

module.exports = router;
