var express = require('express');
var app = express();
var scheme = require("./model/index");
var bodyParser = require('body-parser');
var cors = require('cors');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);
  scheme.User.find({phoneNumber: jwt_payload.phoneNumber}, (err, data) => {
    next(err, data)
  });
});

passport.use(strategy);

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(require('./Controllers'));

app.listen(3001, function () {
  console.log('Example app listening on port 3001!');
});
