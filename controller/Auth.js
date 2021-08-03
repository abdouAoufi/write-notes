const Note = require("../Model/Note");
const User = require("../Model/User");

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
  if (!isLogged) {
    res.render("login.ejs", { pageTitle: "Login", isLogged: false });
  } else {
    res.redirect("/home");
  }
};

exports.postSignUp = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  User.create({ name, password, email })
    .then(() => res.redirect("/home"))
    .catch((err) => console.log(err));
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({
    where: { email: email, password: password },
  })
    .then((user) => {
      if (user) {
        req.session.userId = user.id;
        req.session.isLoggedIn = true;
        res.redirect("/home");
      } else {
        res.redirect("login");
      }
    })

    .catch((err) => console.log(err));
};
