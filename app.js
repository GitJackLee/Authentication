var express = require("express");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/authentication");

app.use(require("express-session")({
  secret: "This is a secret",
  resave: false,
  saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//================
//ROUTES START HERE
//================

app.get("/", function(req, res){
  res.render("home");
});

app.get("/secret", isLoggedIn, function(req, res){
  res.render("secret");
});

//show sign up form
app.get("/register", function(req, res){
  res.render("register");
});

//handle user sign up
app.post("/register", function(req, res){
  req.body.username;
  req.body.password;
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){ //returns username and a hashed password
    if(err){
      console.log(err);
      return res.render("render");
    } else {
      passport.authenticate("local")(req, res, function(){ //logs user name, runs serialize method
        res.redirect("/secret");
      });
    }
  });
});

//LOGIN
//render login form
app.get("/login", function(req, res){
  res.render("login");
});

//passport middleware
app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), function(req, res){
});

app.get("/logout", function(req, res){
  req.logout(); //destroys session
  res.redirect("/");
});

function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, function(){
  console.log("Server Started");
});
