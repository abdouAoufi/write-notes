


exports.homeController = (req , res , next) => {
   res.render("home.ejs" , {pageTitle : "Home"});
}