const User = require("../Model/User");

exports.signUp = (req, res, next) => {
  res.render("signup.ejs", { pageTitle: "Sign up" });
};

exports.login = (req, res, next) => {
  res.render("login.ejs", { pageTitle: "Login" });
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.create({ name, password, email })
    .then(() => console.log("created"))
    .catch((err) => console.log(err));

  res.redirect("/");
};
