'use strict'

var express = require("express");
var bodyParser = require("body-parser");
var tournamentRouter = require('./routers/tournament.route');
var userRouter = require('./routers/user.route');
var teamRouter = require('./routers/team.route');
var cors = require('cors');

var app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cors());

app.use('/v1', userRouter);
app.use('/v1', tournamentRouter);
app.use('/v1', teamRouter);



module.exports = app;
