const requestPromise = require("request-promise");
const HTMLParser = require('node-html-parser');

function getTitlePromise(address) {
    return requestPromise(address)
        .then(function (html) {
            let root = HTMLParser.parse(html);
            return root.querySelector('article').querySelector('h1').childNodes[0].rawText;
        });
}

function getThumbnailURLPromise(address) {
    return requestPromise(address)
        .then(function (html) {
            let root = HTMLParser.parse(html);
            console.log(root.querySelector('article').querySelector('img').rawAttributes);
            return root.querySelector('article').querySelector('img').childNodes[0].rawText;
        });
}

exports.getTitlePromise = getTitlePromise;
exports.getThumbnailURLPromise = getThumbnailURLPromise;
