require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const articleParser = require('article-parser');

const db = require('./db');
const queries = require('./db/queries');
const clickbaitDetector = require('./clickbait-detector');
const auth = require('./auth');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/resources', express.static(__dirname + '/resources'));


// STATIC CONTENT
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/index.html'));
})

app.get('/signUp', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/signUp.html'));
})

app.get('/logIn', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/logIn.html'));
})

app.get('/feed', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/feed.html'));
})

app.get('/detectClickbait', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/detectClickbait.html'));
})

app.get('/unauthorized', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/unauthorized.html'));
})

app.get('/forbidden', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/forbidden.html'));
})

// USER
app.post('/user/signUp', (req, res) => {
    const { username, password } = req.body;
    queries.createAccount(username, password)
        .then(() => res.send({ username: username }))
        .catch(err => {
            console.error(`Failed to create an account: ${err}`);
            res.send({});
        });
})

app.post('/user/logIn', (req, res) => {
    const { username, password } = req.body;
    queries.getUser(username)
        .then(result => {
            if (result) {
                const accessToken = jwt.sign({ username: result.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
                const isPasswordValid = bcrypt.compareSync(password, result.password);
                if (isPasswordValid) {
                    res.send({
                        username: username,
                        accessToken: accessToken
                    });
                } else {
                    console.error('Incorrect username/password');
                    res.send({});
                }
            } else {
                console.error('Incorrect username/password');
                res.send({});
            }
        });
})

app.get('/user/feed', auth.authenticateJWTQueryString, function (req, res) {
    res.sendFile(path.join(__dirname, '/html/userFeed.html'));
})

app.get('/user/profile', auth.authenticateJWTQueryString, function (req, res) {
    res.sendFile(path.join(__dirname, '/html/profile.html'));
})

app.get('/user/revealClickbait', auth.authenticateJWTQueryString, function (req, res) {
    res.sendFile(path.join(__dirname, '/html/revealClickbait.html'));
})

app.get('/user/votedArticleIdsForUser', auth.authenticateJWTQueryString, (req, res) => {
    queries.getVotedArticleIdsForUser(req.query.username)
        .then(ids => res.send({ articleIds: ids }));
})

// ARTICLE
app.post('/article/insert', (req, res) => {
    let article = req.body;
    queries.insertArticle(article)
        .then(() => res.send(`Inserted an article: ${article.uri}`))
        .catch(err => {
            console.error(`Failed to insert an article: ${err}`);
            res.send('Failed to insert an article');
        });
})

app.get('/article/all', (req, res) => {
    queries.getAllArticles()
        .toArray()
        .then((articles) => res.send(articles))
        .catch(err => {
            console.error(`Failed to get all articles: ${err}`);
            res.send('Failed to get all articles');
        });
})

app.get('/article/all/for', (req, res) => {
    queries.getAllArticlesFor(req.query.username)
        .toArray()
        .then((articles) => res.send(articles))
        .catch(err => {
            console.error(`Failed to get all articles for ${user}: ${err}`);
            res.send(`Failed to get all articles for ${user}`);
        });
})

app.post('/article/parse', (req, res) => {
    let uri = req.body.uri;
    let parsedArticle = articleParser.extract(uri);
    let title = parsedArticle.then(result => result.title);
    let imgAddress = parsedArticle.then(result => result.image);
    let source = parsedArticle.then(result => result.source);

    Promise.all([title, imgAddress, source])
        .then((values) => {
            res.send({
                uri: uri,
                title: values[0],
                imgAddress: values[1],
                source: values[2],
                reveal: req.body.reveal,
                votes: req.body.votes,
                revealedBy: req.body.revealedBy
            });
        })
        .catch(err => {
            console.error(`Failed to parse article: ${uri}`);
            res.send('Failed to parse article');
        });
})

app.post('/article/isClickbait', (req, res) => {
    clickbaitDetector.isClickbait(req.body.title).then(result => res.send(result));
})

app.put('/article/vote', auth.authenticateJWTQueryString, (req, res) => {
    const articleId = req.body.articleId;
    queries.voteForArticle(req.query.username, articleId)
        .then(votes => res.send({ votes: votes }));
})

/*
app.post('/article/getTitle', (req, res) => {
    article.parseArticle(req.body.uri)
        .then(parsedArticle => res.send(parsedArticle.title))
        .catch(err => console.error(`Could not get the title of article: ${err}`));
    //article.getTitlePromise(req.body.uri).then(title => res.send(JSON.stringify(`{ title: ${title} }`)));
})

app.post('/article/getThumbnail', (req, res) => {
    article.parseArticle(req.body.uri)
        .then(parsedArticle => res.send(parsedArticle.image))
        .catch(err => console.error(`Could not get the thumbnail of article: ${err}`));
    //article.getThumbnailURLPromise(req.body.uri).then(thumbnailURL => res.send(JSON.stringify(`{ thumbnailURL: ${title} }`)));
})

app.post('/article/getThumbnail', (req, res) => {
    article.parseArticle(req.body.uri)
        .then(parsedArticle => res.send(parsedArticle.image))
        .catch(err => console.error(`Could not get the thumbnail of article: ${err}`));
    //article.getThumbnailURLPromise(req.body.uri).then(thumbnailURL => res.send(JSON.stringify(`{ thumbnailURL: ${title} }`)));
})

app.post('/article/getSource', (req, res) => {
    article.parseArticle(req.body.uri)
        .then(parsedArticle => res.send(parsedArticle.source))
        .catch(err => console.error(`Could not get the source of article: ${err}`));
    //article.getThumbnailURLPromise(req.body.uri).then(thumbnailURL => res.send(JSON.stringify(`{ thumbnailURL: ${title} }`)));
})
*/

db.connect().then(() => {
    app.listen(process.env.APPLICATION_PORT, function () {
        console.log(`Server is listening on: ${process.env.APPLICATION_PORT}`);
    });
});