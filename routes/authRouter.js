const express = require("express");
const Auth = require("../controller/Auth")
const router = express.Router();

router.get("/signup" , Auth.signUp);

router.post("/signup" , Auth.postSignUp);

router.get("/login" , Auth.login);

router.post("/login" , Auth.postLogin);

router.post("/logout" , Auth.postLogout);



router.get("/reset" , Auth.getResetPassword);

router.post("/reset" , Auth.postResetPassword);

router.get("/reset/:token" , Auth.getNewPasswordReset);

router.post("/new-password" , Auth.postNewPassword);


router.get("/back-link.ejs" , Auth.getBackLink);

module.exports = router ;