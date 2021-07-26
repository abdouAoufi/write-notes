


exports.welcomeController = (req , res , next) => {
   res.render("welcome.ejs" , {pageTitle : "Welcome"});
}

exports.homeController = (req , res , next) => {
   res.render("home.ejs" , {pageTitle : "Your notes"});
}

exports.createNoteController = (req , res , next ) => {
   res.render("add-note.ejs" , {pageTitle : "Add note"});
}