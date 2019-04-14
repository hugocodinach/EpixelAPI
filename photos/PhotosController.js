let express = require('express');
let router = express.Router();
let bodyParser = require('body-parser');

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

router.use(bodyParser.urlencoded({ extended: true }));

let db = require('../db');
let Photos = db.EPIXEL.collection('photos');

router.get('/photos', function (req, res) {
    let test = {};
    Photos.find(test, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding photos.");
        let array = users.map(value => {
            return (value.url);
        });
        res.status(200).send(array);
    });
});

module.exports = router;