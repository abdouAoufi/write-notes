exports.signUp = (req , res , next) => {
   res.render("signup.ejs" , {pageTitle : "Sign up"})
}

exports.login = (req , res , next) => {
   res.render("login.ejs" , {pageTitle : "Login"})
}