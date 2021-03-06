"use strict";

const profileLink = document.querySelector('#profile-link');
profileLink.setAttribute('href', '/user/profile?username=' + username + '&accessToken=' + accessToken);
profileLink.innerHTML = username;

const feedLink = document.querySelector('#feed-link');
feedLink.setAttribute('href', '/user/feed?username=' + username + '&accessToken=' + accessToken);

const revealClickbaitForm = document.querySelector('#reveal-clickbait-form');
revealClickbaitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const address = document.querySelector('#article-link').value;
    const shortReveal = document.querySelector('#clickbait-reveal').value;

    fetchParseArticle(address, shortReveal)
        .then(getResponseText)
        .then(detectClickbait);
});

function fetchParseArticle(address, shortReveal) {
    return fetch('/article/parse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            uri: address,
            reveal: shortReveal,
            votes: 0,
            revealedBy: username
        })
    });
}

function detectClickbait(parsedArticle) {
    fetchIsClickbait(parsedArticle)
        .then(getResponseText)
        .then(isClickbait => {
            if (isClickbait === 'true') {
                insertArticle(parsedArticle);
            } else {
                displayClickbaitDetectionWarning(parsedArticle);
            }
        });
}

function fetchIsClickbait(parsedArticle) {
    return fetch('/article/isClickbait', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: parsedArticle
    });
}

function insertArticle(article) {
    fetchInsertArticle(article)
        .then(relocateToFeed);
}

function fetchInsertArticle(article) {
    return fetch('/article/insert?username=' + username + '&accessToken=' + accessToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-store'
        },
        body: article
    });
}

function relocateToFeed() {
    window.location.href = '/user/feed?username=' + username + '&accessToken=' + accessToken
}

function displayClickbaitDetectionWarning(parsedArticle) {
    const main = document.querySelector('main');
    const warning = document.createElement('p');
    warning.classList.add('warning');
    warning.innerHTML = '⚠️ This article was not identified as clickbait by our detector. Of course, we might be wrong. Proceed? ';

    const options = document.createElement('div');
    options.classList.add('row');

    const proceed = document.createElement('a');
    proceed.innerHTML = 'Yes';
    proceed.classList.add('option');
    proceed.addEventListener('click', function (event) {
        insertArticle(parsedArticle);
    });
    options.appendChild(proceed);

    const separator = document.createElement('span');
    separator.innerHTML = 'or';
    separator.classList.add('option');
    options.appendChild(separator);

    const decline = document.createElement('a');
    decline.innerHTML = 'No';
    decline.classList.add('option');
    decline.addEventListener('click', function (event) {
        revealClickbaitForm.reset();
        warning.innerHTML = '';
        options.innerHTML = '';
    });
    options.appendChild(decline);

    main.appendChild(warning);
    main.appendChild(options);
}
