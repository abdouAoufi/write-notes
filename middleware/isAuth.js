module.exports = function (req, res, next) {
  const isAuth = req.session.isLoggedIn;
  if (!isAuth) {
    return res.redirect("/login");
  }
  next();
};
