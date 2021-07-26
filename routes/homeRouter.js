const express = require("express");
const homeController = require("../controller/Home")

const router = express.Router();

// home 
router.get("/" , homeController.welcomeController)

router.get("/home" , homeController.homeController)


module.exports = router ;