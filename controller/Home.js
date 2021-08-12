const User = require("../Model/User");

exports.welcomeController = (req, res, next) => {
  res.render("welcome.ejs", { pageTitle: "Welcome" });
};

exports.homeController = (req, res, next) => {
  User.findByPk(req.session.userId)
    .then((user) => {
      user
        .getNotes()
        .then((notes) => {
          res.render("home", {
            pageTitle: "home",
            user: user,
            isLogged: true,
            notes: notes,
          });
        })
        .catch((err) => {
          const error = new Error(err);
          error.httpStatusCode = 500;
          return next(error);
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.createNoteController = (req, res, next) => {
  res.render("addnote.ejs", { pageTitle: "Add note", isLogged: true });
};

exports.postCreateNote = (req, res, next) => {
  const userId = req.session.userId;
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;
  const image = req.file;
  if (!image) {
    return res.render("addnote.ejs", { pageTitle: "Add note", isLogged: true });
  }
  const imagePath = image.path;

  User.findByPk(userId)
    .then((user) => {
      console.log("found this item");
      if (user) {
        user.createNote({ title, category, content, imagePath }).then(() => {
          res.redirect("/home");
        });
      }
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
