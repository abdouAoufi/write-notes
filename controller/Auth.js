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
        .catch((err) => console.log(err));
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
          req.flash("error", "Something went wrong!");
          return res.redirect("/login");
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

exports.getResetPassword = (req, res, next) => {
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
  console.log("reach this route ......");
  const email = req.body.email;
  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("error", "No account bound with this email");
        return res.redirect("/reset-password");
      }
      crypto.randomBytes(12, (err, buffer) => {
        const token = buffer.toString("hex");
        const tokenExpiration = Date.now() + 36000000;
        user.update({ token: token, tokenExpiration: tokenExpiration });
        req.session.token = token;
        res.redirect("/back-link.ejs");
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/reset-password");
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
      return res.redirect("/login");
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
        return user.update({ password: hashedPassword });
      });
    })
    .then((result) => {
      req.flash("error", "Password reset successfully");
      return res.redirect("/login");
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
