const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/usersdb");

const userToDoList = new Schema({
  phoneNumber: {type: String, unique: true},
  toDoList: [],
}, {
  versionKey: false
});

const userScheme = new Schema({
  lastName: String,
  firstName: String,
  phoneNumber: {type: String, unique: true},
  password: String
}, {
  versionKey: false
});

module.exports.User = mongoose.model("User", userScheme);
module.exports.List = mongoose.model("List", userToDoList);
