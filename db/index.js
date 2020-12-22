require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

let db = null;

module.exports.getDb = () => db;

module.exports.connect = function () {
    return MongoClient.connect(process.env.DATABASE_CONNECT, { useUnifiedTopology: true })
        .then(client => {
            console.log('Connected to database');
            db = client.db('stopclickbait');
            return db;
        })
        .catch(err => {
            console.error(err);
            return Promise.reject(err);
        });
}