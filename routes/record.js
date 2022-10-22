const express = require('express');

const recordRoutes = express.Router();

const dbo = require('../conn');

const ObjectId = require('mongodb').ObjectId;

recordRoutes.route("/resultsRecord").get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB(); 

    resultsDB.collection('electionResults').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route("/racesRecord").get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB(); 

    resultsDB.collection('races').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route("/candidatesRecord").get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB(); 

    candidatesDB.collection('congressionalCandidates').find({}).toArray((err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

recordRoutes.route('/resultsRecord/:id').get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};
    
    resultsDB.collection('electionResults').findOne({newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    }});
});

recordRoutes.route('/racesRecord/:id').get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};
    
    resultsDB.collection('races').findOne({newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    }});
});

recordRoutes.route('/candidatesRecord/:id').get(function (req, res) {
    let [candidatesDB, resultsDB] = dbo.getDB();
    let newQuery = {_id: ObjectId(req.params.id)};
    
    candidatesDB.collection('congressionalCandidates').findOne({newQuery, function (err, result) {
        if (err) throw err;
        res.json(result);
    }});
});

module.exports = recordRoutes;