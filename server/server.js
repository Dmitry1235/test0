var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cors = require('cors')

var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  var user = User.find({phoneNumber: jwt_payload.phoneNumber}, (err, data) => {
    next(err, data)
  });
});

passport.use(strategy);

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())
app.use(passport.initialize());

app.use(bodyParser.urlencoded({
  extended: true
}));


app.get('/', function (req, res) {
  res.send('Hello World321!');
});


const addNoteInMongo = (user, res) => {
  user.save((err) => {
    if (err) return res.status(400).send(err);
    res.send(user);
  });
};

app.post('/registration', function (req, res) {
  console.log('..............', req);
  let user = new User({
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  });

  addNoteInMongo(user, res);
});

const findUserToMongo = (user, res) => {

  User.find(user, (err, data) => {
    if(err) return res.send(err);
    var payload = {id: data.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.status(200).send({data, token})
  });
};

app.post('/entry', function (req, res) {
  let user = {
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  }

  findUserToMongo(user, res);
})
//////////////////////////////////////////////////////////////////Добавление данных в бд
app.post('/addNewItem', passport.authenticate('jwt', { session: false }), function (req, res) {
  let list = {
    phoneNumber: req.body.phoneNumber,
    toDoList:{
      id: req.body.id,
      text: req.body.text,
      isDone: req.body.isDone
    }
  };
  List.update({phoneNumber: list.phoneNumber}, {$addToSet : {toDoList: list.toDoList}}, {upsert: true}, (err, data) => {
    if(err) return res.send(err);
    return res.send(data);
  });
});

////////////////////////////////////////////////////////////////////Вывод данных из бд
const findNumberPhoneList = (number, res) => {
  List.find(number, (err, data) =>{
    if(err) return res.send(err);
    return res.send(data);
  });
};
app.post('/findList', passport.authenticate('jwt', { session: false }), function (req, res) {
  let num = {phoneNumber: req.body.phoneNumber};
  findNumberPhoneList(num, res);
})
//////////////////////////////////////////////////////////////////Обновление состояния isDone-----
app.post('/updateItem', passport.authenticate('jwt', {session: false}), function (req, res) {
  List.findOneAndUpdate({phoneNumber: req.body.phoneNumber, "toDoList.id": Number(req.body.id)}, {'$set': {'toDoList.$.isDone': req.body.isDone}}, (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  })
});
//////////////////////////////////////////////////////////////////
app.get('/deleteBD', function (req, res) {
  User.remove({}, (err, data) => {
    if (err) return res.send(err);
    res.send(data);
  })
});

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// для работы с promise

// установка схемы
const userScheme = new Schema({
  lastName: String,
  firstName: String,
  phoneNumber: {type: String, unique: true},
  password: String
}, {
  versionKey: false
});
// подключение
mongoose.connect("mongodb://localhost:27017/usersdb");

const User = mongoose.model("User", userScheme);



const userToDoList = new Schema({
  phoneNumber: {type: String, unique: true},
  toDoList: [],
},{
  versionKey: false
});
const List = mongoose.model("List", userToDoList);