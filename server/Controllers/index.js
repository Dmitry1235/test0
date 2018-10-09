var express = require('express'),
  router = express.Router();

var passport = require("passport");
var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'tasmanianDevil';

var bdMongo = require("../model/MongoBd");

router.post('/registration', function (req, res) {
  let user = {
    lastName: req.body.lastName,
    firstName: req.body.firstName,
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  };
  bdMongo.addNoteInMongo(user, res);
});

router.post('/entry', function (req, res) {
  let user = {
    phoneNumber: req.body.phoneNumber,
    password: req.body.password
  };
  bdMongo.findUserToMongo(user, res);
});

//////////////////////////////////////////////////////////////////Добавление данных в бд
router.post('/addNewItem', passport.authenticate('jwt', {session: false}), function (req, res) {
  let list = {
    phoneNumber: req.body.phoneNumber,
    toDoList: {
      id: req.body.id,
      text: req.body.text,
      isDone: req.body.isDone
    }
  };
  bdMongo.addDateInMongo(list, res);
});

////////////////////////////////////////////////////////////////////Вывод данных из бд
router.post('/findList', passport.authenticate('jwt', {session: false}), function (req, res) {
  let num = {phoneNumber: req.body.phoneNumber};
  bdMongo.findNumberPhoneList(num, res);
});

router.post('/updateItem', passport.authenticate('jwt', {session: false}), function (req, res) {
  bdMongo.updateIsDone(req, res);
});

module.exports = router;