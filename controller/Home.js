const User = require("../Model/User");
const Note = require("../Model/Note");
const { validationResult } = require("express-validator");
exports.welcomeController = (req, res, next) => {
  res.render("welcome.ejs", {
    pageTitle: "Welcome",
  });
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
  res.render("addnote.ejs", {
    pageTitle: "Add note",
    isLogged: true,
  });
};

exports.postCreateNote = (req, res, next) => {
  const userId = req.session.userId;
  const title = req.body.title;
  const category = req.body.category;
  const content = req.body.content;
  const image = req.file;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = errors.array()[0].msg;
    return res.redirect("/create-note");
  }
  // if (!image) {
  //   return res.render("addnote.ejs", { pageTitle: "Add note", isLogged: true });
  // }
  let imagePath = null;
  if (image) {
    imagePath = image.path;
  }

  User.findByPk(userId)
    .then((user) => {
      console.log("found this item");
      if (user) {
        user
          .createNote({
            title: title ? title : "dummy title",
            category: category ? category : "dummy category",
            content: content ? content : "dummy content",
            imagePath: imagePath ? imagePath : "",
          })
          .then(() => {
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

exports.deleteNote = (req, res, next) => {
  Note.destroy({
    where: {
      id: req.body.elementId,
      userId: req.session.userId,
    },
  })
    .then((result) => console.log(res.redirect("/home")))
    .catch((err) => console.log(err));
};
