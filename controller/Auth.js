const Note = require("../Model/Note");
const User = require("../Model/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

exports.signUp = (req, res, next) => {
  const isLogged = req.session.isLoggedIn;
  if (!isLogged) {
    res.render("signup.ejs", { pageTitle: "Sign up", isLogged: false });
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

  console.log(name, email, password);
  User.findOne({ where: { email: email } })
    .then((user) => {
      console.log(user);
      if (user) {
        req.flash("error", "This email is already exists!");
        return res.redirect("/signup");
      }
      bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          User.create({ name: name, password: hashedPassword, email: email })
            .then(() => res.redirect("/home"))
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(42, err);
          return res.redirect("/signup");
        });
    })
    .catch((err) => {
      return res.redirect("/signup");
    });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.flash("error", "No account bound with this email");
        return res.redirect("/login");
      }
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
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  // destroy the session
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
