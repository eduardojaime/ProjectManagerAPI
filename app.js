var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// Import the mongoose module and globals file
const mongoose = require("mongoose");
const config = require("./config/globals");

const passport = require("passport");
const BasicStrategy = require("passport-http").BasicStrategy;

var indexRouter = require("./routes/index");
const projectsRouter = require("./routes/api/projects");

// Import packages needed for SwaggerUI/OpenAPI 
// allows you to render a user-friendly swagger UI documentation page
const swaggerUI = require('swagger-ui-express'); 
// allows you to load a yaml file into an object
const YAML = require('yamljs'); 
// for parsing comments into OpenAPI
const swaggerJSDoc = require('swagger-jsdoc'); 

var app = express();

// enable CORS using npm package
var cors = require('cors');
app.use(cors());

// 1) Load OpenAPI file from local YAML file
const swaggerDocument = YAML.load('./docs/project-tracker-api.yaml');
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Initialize passport module
app.use(passport.initialize());
// Implement Basic Strategy
passport.use(
  new BasicStrategy((username, password, done) => {
    // MongoDB
    // User.findOne({username: username}, function(err, user) {
    //   if (!user.verifyPassword(password)) {
    //     return done(null, false);
    //   }
    //   return done(null, user);
    // });
    if (username == "admin" && password == "georgian123") {
      console.log("Admin authenticated successfully!");
      return done(null, username);
    } else {
      console.log(username + " tried to authenticate unsuccessfully!");
      return done(null, false);
    }
  })
);

app.use("/", indexRouter);
// Best practice is to put all API related endpoints in their own section
app.use(
  "/api/projects",
  passport.authenticate("basic", { session: false }),
  projectsRouter
);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

//Connect to Mongo DB after all controller/router configuration
mongoose
  .connect(config.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((message) => {
    console.log("Connected successfully!");
  })
  .catch((error) => {
    console.log(`Error while connecting! ${error}`);
  });

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
