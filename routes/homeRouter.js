const express = require("express");
const homeController = require("../controller/Home");
const isAuth = require("../middleware/isAuth")
const router = express.Router();

// home
router.get("/", homeController.welcomeController);

router.get("/home", isAuth , homeController.homeController);

router.get("/create-note", isAuth , homeController.createNoteController);

router.post("/create-note", isAuth , homeController.postCreateNote);

module.exports = router;
