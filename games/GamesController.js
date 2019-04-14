let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');
let ObjectId = require('mongodb').ObjectID;

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let db = require('../db');
let Games = db.EPIXEL.collection('games');

function sortGames(games) {
    for (let i = 0; i < games.length; i += 1) {
        if (games[i + 1] && games[i].name > games[i + 1].name) {
            let tmp = Object.assign({}, games[i]);
            games[i] = Object.assign({}, games[i + 1]);
            games[i + 1] = Object.assign({}, tmp);
            i = -1;
        }
    }
    return games;
}

router.get('/games', function (req, res) {
    let test = {};
    Games.find(test, function (err, games) {
        if (err) return res.status(500).send("There was a problem finding games.");
        games = sortGames(games);
        res.status(200).send(games);
    });
});

router.post('/games', function (req, res) {
    if (!req.body.name || !req.body.img)
        return res.status(400).send({ msg: "Need a name and an image." });
    Games.insert({
        name: req.body.name,
        img: req.body.img,
    },
        function (err, games) {
            if (err) return res.status(500).send({ msg: "There was a problem adding the information to the database." });
            Games.find({}, function (err, games) {
                if (err) return res.status(500).send("There was a problem finding games.");
                games = sortGames(games);
                res.status(200).send(games);
            });
        });
});

router.put('/games', function (req, res) {
    if (!req.body.name || !req.body.img || !req.body.ObjectId)
        return res.status(400).send({ msg: "Need a name and an image." });
    Games.update({ _id: ObjectId(req.body.ObjectId) }, {
        name: req.body.name,
        img: req.body.img,
    },
        function (err, game) {
            if (err) return res.status(500).send({ msg: "There was a problem adding the information to the database." });
            Games.find({}, function (err, games) {
                if (err) return res.status(500).send("There was a problem finding games.");
                games = sortGames(games);
                res.status(200).send(games);
            });
        });
});

router.delete('/games', function (req, res) {
    console.log(req.body);
    if (!req.body.ObjectId)
        return res.status(400).send({ msg: "Need an ObjectId" });
    Games.remove({ _id: ObjectId(req.body.ObjectId) },
        function (err, game) {
            if (err) return res.status(500).send({ msg: "There was a problem deleting the information to the database." });
            Games.find({}, function (err, games) {
                if (err) return res.status(500).send("There was a problem finding games.");
                games = sortGames(games);
                res.status(200).send(games);
            });
        }
    );
});

module.exports = router;