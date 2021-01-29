"use strict";

const revealClickbaitButton = document.querySelector('#reveal-clickbait-button');
revealClickbaitButton.setAttribute('href', '/user/revealClickbait?username=' + username + '&accessToken=' + accessToken);

const profileLink = document.querySelector('#profile-link');
profileLink.setAttribute('href', '/user/profile?username=' + username + '&accessToken=' + accessToken);

const sortBy = document.querySelector('#sort-by');
sortBy.addEventListener('change', function () {
    loadArticles(false, this.value);
});

loadArticles(false, 'most-recent');
