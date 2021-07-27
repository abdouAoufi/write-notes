const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const homeRouter = require("./routes/homeRouter");
const app = express();
const errRouter = require("./routes/404");
const authRouter = require("./routes/authRouter");
const db = require("./util/database");
const User = require("./Model/User");
const Note = require("./Model/Note");

// { force: true }
db.sync()
  .then(() => console.log("Connected !"))
  .catch((err) => console.log("Error !", err));

// set up view engine
// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// set up relations
Note.belongsTo(User, { onDelete: "CASCADE", constrain: true });
User.hasMany(Note);

// set up request
app.use(bodyParser.urlencoded({ extended: false }));

// set up static files
app.use(express.static(path.join(__dirname, "public")));

app.use(authRouter);
app.use(homeRouter);
app.use(errRouter);

app.listen(3000);
