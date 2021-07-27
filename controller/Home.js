const User = require("../Model/User");

exports.welcomeController = (req, res, next) => {
  res.render("welcome.ejs", { pageTitle: "Welcome" });
};

exports.homeController = (req, res, next) => {
  res.render("home.ejs", { pageTitle: "Your notes", user: null });
};

exports.createNoteController = (req, res, next) => {
  const user = req.params.userId;
  res.render("add-note.ejs", { pageTitle: "Add note", userId: user });
};

exports.postCreateNote = (req, res, next) => {
  const userId = req.body.userId;
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;
  console.log(21 , userId)
  User.findByPk(userId)
    .then((user) => {
      console.log("found this item")
      console.log(user);
      res.redirect("/");
    })
    .catch((err) => console.log(err));

};
