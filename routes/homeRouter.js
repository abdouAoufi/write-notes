const express = require("express");
const homeController = require("../controller/Home");
const isAuth = require("../middleware/isAuth");
const router = express.Router();
const { body } = require("express-validator");
// home
router.get("/", homeController.welcomeController);

router.get("/home", isAuth, homeController.homeController);

router.get("/create-note", isAuth, homeController.createNoteController);

router.post(
  "/create-note",
  isAuth,
  [
    body("title")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Invalid title ..."),
    body("content")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Invalid content ..."),
      body("category")
      .isString()
      .isLength({ min: 5 })
      .withMessage("Invalid category ..."),
  ],
  homeController.postCreateNote
);

router.post("/delete", isAuth, homeController.deleteNote);

module.exports = router;
