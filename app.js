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
const csrf = require("csurf");
const MySQLStore = require("express-mysql-session")(session);
const flash = require("connect-flash");
const multer = require("multer");
const helmet = require("helmet"); // secure
const compression = require("compression"); // reduce files sizes
const morgan = require("morgan"); // loggin details
const fs = require("fs");


// set up view engine
// set up a view engine in our case is EJS
app.set("view engine", "ejs");
app.set("views", "views");

// set up parsing request
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set up static files
app.use(express.static(path.join(__dirname, "public")));
app.use("/images" ,express.static(path.join(__dirname, "images")));
app.use(helmet());
app.use(compression());
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));
const protection = csrf();

// storeage configuration
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

// filter files so only images are accepted ...
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

db.sync()
  .then(() => {
    console.log(process.env.PORT)
    console.log("Connected !");
    app.listen(3001 || process.env.PORT);
  })
  .catch((err) => {});

// set up relations
Note.belongsTo(User, { onDelete: "CASCADE", constrain: true });
User.hasMany(Note);

var options = {
  host: "bkr7mvenigi7x98fawjf-mysql.services.clever-cloud.com",
  port: 3306,
  user: "uxdxbakayeluo7ax",
  password: "ptipiiNJ76k5TKxIS4yc",
  database: "bkr7mvenigi7x98fawjf",
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

app.use(protection);
app.use(flash());
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
); // recive file from ....
// { force: true }

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRouter);
app.use(homeRouter);
app.use(errRouter);

app.use((err, req, res, next) => {
  console.log(err)
  res.render("500.ejs", { pageTitle: "Server problem", err: err });
});
