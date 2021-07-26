const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// set up view engine
// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// set up request 
app.use(bodyParser.urlencoded({ extended: false }));

// set up static files 
app.use(express.static(path.join(__dirname, "public")));


app.use("/" , (req , res , next)=> {
   console.log(req.body)
   res.send("<h1>hello world </h1>")
})

app.listen(3000);