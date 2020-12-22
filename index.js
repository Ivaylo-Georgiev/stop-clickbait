require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const articleParser = require('article-parser');

const db = require('./db');
const queries = require('./db/queries');
const clickbaitDetector = require('./clickbait-detector');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use('/js', express.static(__dirname + '/js'));
app.use('/css', express.static(__dirname + '/css'));
app.use('/resources', express.static(__dirname + '/resources'));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.get('/feed', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/feed.html'));
});

app.get('/detectClickbait', function (req, res) {
    res.sendFile(path.join(__dirname, '/html/detectClickbait.html'));
});

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

app.post('/article/parse', (req, res) => {
    let uri = req.body.uri;
    let parsedArticle = articleParser.extract(uri);
    let title = parsedArticle.then(result => result.title);
    let imgAddress = parsedArticle.then(result => result.image);
    let source = parsedArticle.then(result => result.source);

    Promise.all([title, imgAddress, source])
        .then((values) => {
            res.send({
                title: values[0],
                imgAddress: values[1],
                source: values[2],
                reveal: req.body.uri,
                votes: req.body.votes
            });
        })
        .catch(err => {
            console.error(`Failed parse article: ${uri}`);
            res.send('Failed to parse article');
        });
})

app.post('/article/isClickbait', (req, res) => {
    clickbaitDetector.isClickbait(req.body.title).then(result => res.send(result));
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