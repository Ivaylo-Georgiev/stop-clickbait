const mongodb = require('mongodb');
const { getDb } = require('./index');

function insertArticle(article) {
    const db = getDb();
    return db.collection('articles').insertOne(article);
}

function getAllArticles() {
    const db = getDb();
    return db.collection('articles').find({}).sort([['_id', -1]]);
}

module.exports.insertArticle = insertArticle;
module.exports.getAllArticles = getAllArticles;