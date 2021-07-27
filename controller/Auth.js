const Note = require("../Model/Note");
const User = require("../Model/User");

exports.signUp = (req, res, next) => {
  res.render("signup.ejs", { pageTitle: "Sign up" });
};

exports.login = (req, res, next) => {
  res.render("login.ejs", { pageTitle: "Login", failToLog: false });
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
        user
          .getNotes()
          .then((result) => {
            res.render("home", {
              pageTitle: "home",
              user: user,
              notes: result,
            });
          })
          .catch((err) => console.log(err));
      } else {
        res.render("login", { pageTitle: "Login", failToLog: true });
      }
    })

    .catch((err) => console.log(err));
};
