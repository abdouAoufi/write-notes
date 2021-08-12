const express = require("express");
const Auth = require("../controller/Auth");
const Reset = require("../controller/Reset")
const router = express.Router();
const { body } = require("express-validator");
const User = require("../Model/User");

router.get("/signup", Auth.signUp);

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please insert a vlaid email!")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          if (userDoc) {
            console.log(userDoc);
            return Promise.reject(
              "Email already exists, pick up one different!!"
            );
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum length is 5 characteres"),
  ],
  Auth.postSignUp
);

router.get("/login", Auth.login);

router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .withMessage("Please insert a vlaid email!")
      .custom((value, { req }) => {
        return User.findOne({ where: { email: value } }).then((userDoc) => {
          if (!userDoc) {
            return Promise.reject(
              "This email is not bound with any account!!"
            );
          }
          return true;
        });
      })
      .normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Minimum length is 5 characteres"),
  ],
  Auth.postLogin
);

router.post("/logout", Auth.postLogout);

router.get("/reset", Reset.getResetPassword);

router.post("/reset", Reset.postResetPassword);

router.get("/reset/:token", Reset.getNewPasswordReset);

router.post("/new-password", Reset.postNewPassword);

router.get("/back-link.ejs", Reset.getBackLink);

module.exports = router;
