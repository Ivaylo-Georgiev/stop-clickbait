const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use('/isClickbait', createProxyMiddleware({
    target: 'http://localhost:3000/article/',
    headers: {
        accept: "application/json",
        method: "GET",
    },
    changeOrigin: true
}));

app.use('/parse', createProxyMiddleware({
    target: 'http://localhost:3000/article/',
    headers: {
        accept: "application/json",
        method: "GET",
    },
    changeOrigin: true
}));

app.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.use('/js', express.static(__dirname + '/js'));

app.listen(8080);