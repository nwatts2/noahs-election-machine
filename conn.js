const {MongoClient} = require('mongodb');
let candidatesDB, resultsDB;

module.exports = {
    connectDB: function () {
        MongoClient.connect(process.env.DATABASE_URL)
        .then(function (result) {
            candidatesDB = result.db('candidates');
            resultsDB = result.db('results');
            console.log('Connected to Database');
        })
        .catch(function (err) {
            console.error(err);
            throw err;
        })
    },
    getDB: function () {
        return [candidatesDB, resultsDB];
    }
};