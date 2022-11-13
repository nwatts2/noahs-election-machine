const express = require('express');
const nodemailer = require('nodemailer');

const recordRoutes = express.Router();

const dbo = require('../conn');

const ObjectId = require('mongodb').ObjectId;

const transport = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APPKEY
    }
}

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
    if (error) {console.log(error)}
    else {console.log('Server is ready to take messages.')}
});

recordRoutes.route("/send").post((req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const content = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const mail = {
        from: name,
        to: 'noah@noahselectionmachine.com',
        subject: 'New Contact Form Message',
        text: content
    }
    transporter.sendMail(mail, (err, data) => {
        if (err) {
            res.json({status: 'fail'});
        } else {
            res.json({status: 'success'});
        }
    })
})

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