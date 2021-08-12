const User = require("../Model/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

exports.getResetPassword = (req, res, next) => {
  console.log("Executing this line ...");
  const isLogged = req.session.isLoggedIn;
  let errorMessage = req.flash("error");
  if (errorMessage.length > 0) {
    errorMessage = errorMessage[0];
  } else {
    errorMessage = null;
  }
  if (isLogged) {
    res.redirect("/home");
  }
  res.render("reset-password.ejs", {
    isLogged: isLogged,
    pageTitle: "Reset password",
    errorMessage: errorMessage,
  });
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("error", "No account bound with this email");
        return res.render("reset-password.ejs", {
          pageTitle: "Reset password",
          isLogged: false,
          errorMessage: req.flash("error"),
        });
      }
      // gernerate random link ...
      crypto.randomBytes(12, (err, buffer) => {
        const token = buffer.toString("hex");
        const tokenExpiration = Date.now() + 36000000;
        user.update({ token: token, tokenExpiration: tokenExpiration });
        req.session.token = token;
        res.redirect("/back-link.ejs");
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getNewPasswordReset = (req, res) => {
  const isLogged = req.session.isLoggedIn;
  if (isLogged) {
    return res.redirect("/home");
  }
  const token = req.params.token;
  User.findOne({ where: { token: token } })
    .then((user) => {
      if (!user) {
        res.redirect("/login");
      }
      res.render("new-password.ejs", {
        pageTitle: "Updating password",
        isLogged: isLogged,
        token: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postNewPassword = (req, res) => {
  const password = req.body.password;
  const token = req.body.token;
  User.findOne({ token: token })
    .then((user) => {
      if (!user) {
        return res.redirect("/login");
      }
      bcrypt.hash(password, 12).then((hashedPassword) => {
        user.update({ password: hashedPassword }).then((result) => {
          req.flash("error", "Password reset successfully");
          return res.redirect("/login");
        });
      });
    })
    .catch((err) => {
      return res.redirect("/login");
    });
};

exports.getBackLink = (req, res) => {
  const token = req.session.token;
  const link = `http://localhost:3000/reset/${token}`;
  res.render("back-link.ejs", { pageTitle: "reset password", link: link });
};
