const express = require("express");
const homeController = require("../controller/Home")

const router = express.Router();

// home 
router.get("/" , homeController.homeController)


module.exports = router ;