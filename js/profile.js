"use strict";

const revealClickbaitButton = document.querySelector('#reveal-clickbait-button');
revealClickbaitButton.setAttribute('href', '/user/revealClickbait?username=' + username + '&accessToken=' + accessToken);

const feedLink = document.querySelector('#feed-link');
feedLink.setAttribute('href', '/user/feed?username=' + username + '&accessToken=' + accessToken);

const sortBy = document.querySelector('#sort-by');
sortBy.addEventListener('change', function () {
    loadArticles(true, this.value);
});

function appendDeleteButtons() {
    const userArticles = document.querySelectorAll('revealed-clickbait');
    for (const userArticle of userArticles) {
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = 'Delete';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            fetch('/article?username=' + username + '&accessToken=' + accessToken, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ articleId: userArticle.id.slice(9) })
            }).then(() => document.querySelector('#' + userArticle.id).remove());
        });
        deleteButton.slot = 'delete-button';

        userArticle.appendChild(deleteButton);
    }
}

loadArticles(true, 'most-recent')
    .then(appendDeleteButtons);




