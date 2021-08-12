const Note = require("../Model/Note");
const User = require("../Model/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.signUp = (req, res, next) => {
  const isLogged = req.session.isLoggedIn;
  if (!isLogged) {
    res.render("signup.ejs", {
      pageTitle: "Sign up",
      isLogged: false,
      errorMessage: null,
    });
  } else {
    res.redirect("/home");
  }
};

exports.login = (req, res, next) => {
  const isLogged = req.session.isLoggedIn;
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (!isLogged) {
    res.render("login.ejs", {
      pageTitle: "Login",
      isLogged: false,
      errorMessage: errorMessage,
    });
  } else {
    res.redirect("/home");
  }
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.render("signup.ejs", {
      pageTitle: "Sign up",
      isLogged: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      User.create({ name: name, password: hashedPassword, email: email })
        .then(() => {
          res.redirect("/home");
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      console.log(42, err);
      return res.redirect("/signup");
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("login.ejs", {
      pageTitle: "login",
      isLogged: false,
      errorMessage: errors.array()[0].msg,
    });
  }
  User.findOne({ where: { email: email } })
    .then((user) => {
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (doMatch) {
            req.session.userId = user.id;
            req.session.isLoggedIn = true;
            res.redirect("/home");
          } else {
            req.flash("error", "Password incorrect!");
            return res.redirect("/login");
          }
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      return res.redirect("/login");
    });
};

exports.postLogout = (req, res) => {
  // destroy the session
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};

