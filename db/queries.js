const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { getDb } = require('./index');

function createAccount(username, password) {
    const db = getDb();

    return getUser(username)
        .then(user => {
            if (user) {
                throw new Error(`Username ${username} already exists`);
            }

            const rounds = 10;
            const hashPassword = bcrypt.hashSync(password, rounds);

            user = {
                username: username,
                password: hashPassword
            }

            db.collection('usersVotes')
                .insertOne({
                    username: username,
                    articleIds: []
                });

            return db.collection('users')
                .insertOne(user);
        });
}

function getUser(username) {
    const db = getDb();

    return db.collection('users')
        .find({ username: username })
        .toArray()
        .then(users => {
            if (users.length === 0) {
                return null;
            }

            return users[0];
        });
}

function insertArticle(article) {
    const db = getDb();
    return db.collection('articles').insertOne(article);
}

function getAllArticles(orderedBy) {
    const db = getDb();
    return db.collection('articles').find({}).sort([[orderedBy, -1]]);
}

function getAllArticlesFor(user, orderedBy) {
    const db = getDb();
    return db.collection('articles').find({ revealedBy: user }).sort([[orderedBy, -1]]);
}

function getVotedArticleIdsForUser(username) {
    const db = getDb();
    return db.collection('usersVotes')
        .find({ username: username })
        .toArray()
        .then(userVotesList => {
            const userVotes = userVotesList[0];
            return userVotes.articleIds;
        });
}

function voteForArticle(username, articleId) {
    const db = getDb();
    return db.collection('articles')
        .find({ _id: mongodb.ObjectId(articleId) })
        .toArray()
        .then(articles => {
            return articles[0];
        })
        .then(article => {
            return getVotedArticleIdsForUser(username)
                .then(articleIds => {
                    if (articleIds.includes(articleId)) {
                        db.collection('usersVotes')
                            .updateOne(
                                { username: username },
                                { $pull: { articleIds: articleId } }
                            );
                        article.votes -= 1;
                    } else {
                        db.collection('usersVotes')
                            .updateOne(
                                { username: username },
                                { $addToSet: { articleIds: articleId } }
                            );
                        article.votes += 1;
                    }

                    return db.collection('articles')
                        .updateOne(
                            { _id: mongodb.ObjectId(articleId) },
                            { $set: { votes: article.votes } }
                        )
                        .then(result => article.votes);
                });
        });
}

module.exports.createAccount = createAccount;
module.exports.insertArticle = insertArticle;
module.exports.getAllArticles = getAllArticles;
module.exports.getAllArticlesFor = getAllArticlesFor;
module.exports.getUser = getUser;
module.exports.getVotedArticleIdsForUser = getVotedArticleIdsForUser;
module.exports.voteForArticle = voteForArticle;