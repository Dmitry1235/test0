const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// для работы с promise

// установка схемы
const userScheme = new Schema({
  lastName: String,
  firstName: String,
  phoneNumber: String,
  password: Number
}, {
  versionKey: false
});

// подключение
mongoose.connect("mongodb://localhost:27017/usersdb");

const User = mongoose.model("User", userScheme);
let user = new User({
  lastName: 'Admigdsfgdsf',
  firstName: 'gsdfgsdfin',
  phoneNumber: '121113456',
  password: 123123123
});

user.save(function (err, result) {
  mongoose.disconnect();
  if (err) return console.log(err);
  console.log("Сохранен объект", result);
});

/*
User.remove({}, function (err, result) {
  mongoose.disconnect();
  if(err) return console.log(err);
  console.log('.....Удалено....', result);
});*/






