var jwt = require('jsonwebtoken');
var scheme = require("./index");

var passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'tasmanianDevil';

module.exports.addNoteInMongo = (user, res) => {
  user = new scheme.User(user);
  user.save((err) => {
    if (err) return res.status(400).send(err);
    res.send(user);
  });
};

module.exports.findUserToMongo = (user, res) => {
  scheme.User.find(user, (err, data) => {
    if (err) return res.send(err);
    var payload = {id: data.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.status(200).send({data, token})
  });
};

module.exports.findNumberPhoneList = (number, res) => {
  scheme.List.find(number, (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  });
};

module.exports.addDateInMongo = (list, res) => {
  scheme.List.update({phoneNumber: list.phoneNumber}, {$addToSet: {toDoList: list.toDoList}}, {upsert: true}, (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  });
};

module.exports.updateIsDone = (req, res) => {
  scheme.List.findOneAndUpdate({
    phoneNumber: req.body.phoneNumber,
    "toDoList.id": Number(req.body.id)
  }, {'$set': {'toDoList.$.isDone': req.body.isDone}}, (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  })
};
