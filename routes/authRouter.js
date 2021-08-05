const express = require("express");
const Auth = require("../controller/Auth")
const router = express.Router();

router.get("/signup" , Auth.signUp);

router.post("/signup" , Auth.postSignUp);

router.get("/login" , Auth.login);

router.post("/login" , Auth.postLogin);

router.post("/logout" , Auth.postLogout);

module.exports = router ;