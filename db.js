var mongojs = require('mongojs');
var pass = require('./mdp');
var EPIXEL = mongojs(pass.db);

var db = {EPIXEL};

module.exports = db;