const express = require("express");
const Auth = require("../controller/Auth")
const router = express.Router();

router.get("/signup" , Auth.signUp);

router.post("/signup" , Auth.postSignUp);

router.get("/login" , Auth.login);

module.exports = router ;