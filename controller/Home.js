


exports.welcomeController = (req , res , next) => {
   res.render("welcome.ejs" , {pageTitle : "Welcome"});
}

exports.homeController = (req , res , next) => {
   res.render("home.ejs" , {pageTitle : "Your notes"});
}