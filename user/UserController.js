let express = require('express');
let router = express.Router();
let sha256 = require('sha256');
let bodyParser = require('body-parser');
let tools = require('../tools/tokenValid');
let generator = require('generate-password');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
router.use(bodyParser.urlencoded({ extended: true }));

let db = require('../db');
let User = db.EPIXEL.collection('users');
let Token = db.EPIXEL.collection('tokens');


router.post('/users/new/', function (req, res) {
    if (!req.body.user || !req.body.pass)
        return res.status(400).send({ msg: "Need an user and a pass." });
    User.find({ "user": req.body.user }, (err, users) => {
        if (users[0])
            return res.status(403).send({ msg: "Login already used." });
        let newToken = Math.floor(Math.random() * Math.floor(999999999999999)).toString();
        User.insert({
            user: req.body.user,
            pass: req.body.pass,
            token: newToken,
            creationDate: new Date(),
        },
        function (err, user) {
            if (err) return res.status(500).send({ msg: "There was a problem adding the information to the database."});
            res.status(200).send(user);
        });
    });
});

function createNewToken(userId) {
    let newToken = Math.floor(Math.random() * Math.floor(999999999999999)).toString();
    Token.insert({
        token: newToken,
        userId: userId,
        createDate: new Date(),
        tokenExpiration: -1
    })
    return newToken;
}

router.get('/users/login', function (req, res) {
    if (!req.query.user || !req.query.pass)
        return res.status(400).send("Need a login and a password")
    let test = {"user": req.query.user, "pass": req.query.pass};
    User.find(test, function (err, users) {
        if (users[0] === undefined)
            return res.status(404).send("Invalid user or password");
        if (err) return res.status(500).send("There was a problem finding the user.");
        Token.find({"userId":users[0]._id}, function(err, tokens) {
            let newToken = {
                token : ""
            };
            if (tokens[0] === undefined) {
                newToken.token = createNewToken(users[0]._id);
                res.status(200).send(newToken);
            } else {
                Token.remove({"userId":users[0]._id}, function (err, token) {
                    if (err) return res.status(500).send("There was a problem deleting the token.");
                    newToken.token = createNewToken(users[0]._id);
                res.status(200).send(newToken);
                })
            }
        })
    });
});

router.get('/users/token/valid', function (req, res) {
    tools.tokenIsValid(req.query.token, res, function (isvalid, token) {
        if (isvalid !== -1)
            res.status(200).send(isvalid);
    });

});

module.exports = router;