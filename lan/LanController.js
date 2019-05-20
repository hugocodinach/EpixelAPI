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
let Lan = db.EPIXEL.collection('lan');

router.get('/lan', function (req, res) {
    let test = {};
    Lan.find(test, function (err, lans) {
        if (err) return res.status(500).send("There was a problem finding lan.");
        if (!lans[0]) return res.status(200).send({});
        res.status(200).send(lans[0]);
    });
});

router.post('/lan', function (req, res) {
    Lan.insert({
        name: 'Lan',
        date: new Date(),
        games: [],
        form: ''
    },
        function (err, lan) {
            if (err) return res.status(500).send({ msg: "There was a problem adding the information to the database." });
            res.status(200).send(lan);
        });
});

router.put('/lan', function (req, res) {
    if (!req.body.name || !req.body.date || !req.body.games || !req.body.ObjectId)
        return res.status(400).send({ msg: "Need a name, a date, games, and an ObjectId." });
    Lan.update({ _id: ObjectId(req.body.ObjectId) }, {
        name: req.body.name,
        date: req.body.date,
        games: req.body.games
    }, function (err, lan) {
        if (err) return res.status(500).send({ msg: "There was a problem adding the information to the database." });
        Lan.find({}, function (err, lans) {
            if (err) return res.status(500).send("There was a problem finding games.");
            if (!lans[0]) return res.status(200).send({});
            res.status(200).send(lans[0]);
        });
    });
});

module.exports = router;