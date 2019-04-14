var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/UserController');
var PhotosController = require('./photos/PhotosController');
var LanController = require('./lan/LanController');
var GamesController = require('./games/GamesController');

app.use(UserController, PhotosController, LanController, GamesController);

module.exports = app;