const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const homeRouter = require("./routes/homeRouter")
const app = express();
const errRouter = require("./routes/404")
const authRouter = require("./routes/authRouter");






// set up view engine
// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// set up request 
app.use(bodyParser.urlencoded({ extended: false }));

// set up static files 
app.use(express.static(path.join(__dirname, "public")));


app.use(homeRouter)
app.use(authRouter)
app.use(errRouter)


app.listen(3000);