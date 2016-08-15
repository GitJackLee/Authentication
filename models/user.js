var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

//Needs to be after Schema
UserSchema.plugin(passportLocalMongoose); //takes package, adds methods to schema

module.exports = mongoose.model("User", UserSchema);
