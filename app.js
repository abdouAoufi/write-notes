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
const session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);


db.sync()
  .then(() => {
    console.log("Connected !");
    app.listen(3000);
  })
  .catch((err) => console.log("Error !", err));


var options = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "abdou1331",
  database: "todo",
};

var sessionStore = new MySQLStore(options);

app.use(
  session({
    key: "session_cookie_name",
    secret: "session_cookie_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// { force: true }

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
