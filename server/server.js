var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Hello World321!');
});

app.post('/registration', function (req, res) {
  console.log('..............', req);
  let user = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  });
  user.save((err, data) => {
    if (err) return res.send("error");
    res.send(user);

  })
});

app.get('/test_route:lastName.:firstName.:phoneNumber.:password', function (req, res) {
  const lastName = req.params["lastName"];
  const firstName = req.params["firstName"];
  const phoneNumber = req.params["phoneNumber"];
  const password = req.params["password"];
//  addMongoDB(lastName, firstName, phoneNumber,password);
  res.send(`File: ${lastName}.${firstName}.${phoneNumber}.${password}`);
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});

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

addMongoDB = (lastName, firstName, phoneNumber, password) => {

  let user = new User({
    lastName: lastName,
    firstName: firstName,
    phoneNumber: phoneNumber,
    password: password
  });

  // user.save(function (err, result) {
  //   mongoose.disconnect();
  //   if (err) return console.log(err);
  //   console.log("Сохранен объект", result);
  // });
}

