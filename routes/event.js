var express = require('express');
var router = express.Router();
var Event = require('../models/event').Event;
var mongoose = require('../libs/mongoose');
var ObjectID = require('mongodb').ObjectId;

/* GET events listing page */
router.get('/:date', function (req, res, next) {
    var start = new Date(req.params.date);
    var end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(end.getDate() - 1);
    res.render('events', {
        start: start.toISOString(),
        end: end.toISOString()
    });
});

/* GET events from start to end */
router.get('/', function (req, res, next) {
    var start = new Date(req.query.start);
    var end = new Date(req.query.end);
    Event.find({
        $and: [{
            date: {
                $gte: start
            }
        }, {
            date: {
                $lte: end
            }
        }]
    }, function (err, events) {
        if (err) return next(err);
        if (events == null) {
            events = [];
        }
        res.json({
            count: events.length,
            data: events
        });
    })
});

/* GET events from start to end */
router.get('/id/:id', function (req, res, next) {
    var id = new ObjectID(req.params.id);
    console.log(req.params.id);
    Event.findById(id, function (err, event) {
        if (err) return next(err);
        console.log(event);
        if (event == null) {
            res.sendStatus(400);
            res.end();
        } else {
            res.json(event);
        }
    });
});


/* POST new event */
router.post('/', function (req, res, next) {
    var date = new Date(req.body.date);
    var name = req.body.name;
    var desc = req.body.description;
    var event = new mongoose.models.Event({
        date: date,
        name: name,
        description: desc
    });
    event.save(function (err) {
        if (err) return next(err);
        res.sendStatus(201);
        res.end();
    });
});

router.put('/', function (req, res, next) {
    var date = new Date(req.body.date);
    var name = req.body.name;
    var desc = req.body.description;
    var id = new ObjectID(req.body.id);
    Event.findOneAndUpdate({_id: id}, req.body, function(err, event) {
       if (err) return next(err);
        /*if (event == null) {
            res.sendStatus(400);
            res.end();
        } else {
            event.date = date;
            event.name = name;
            event.description = desc;
            event.save(function (err) {
                if (err) return next(err);
                res.sendStatus(204);
                res.end();
            });
        }*/
        res.sendStatus(204);
        res.end();
    });
});

router.delete('/', function (req, res, next) {
    var eid = req.body.id;
    Event.remove({_id: new ObjectID(eid)}, function(err) {
       if (err) return next(err);
        res.sendStatus(204);
        res.end();
    });
});

module.exports = router;
