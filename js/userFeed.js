const revealClickbaitButton = document.querySelector('#reveal-clickbait-button');
revealClickbaitButton.setAttribute('href', '/user/revealClickbait?username=' + username + '&accessToken=' + accessToken);

const profileLink = document.querySelector('#profile-link');
profileLink.setAttribute('href', '/user/profile?username=' + username + '&accessToken=' + accessToken);

loadArticles(false);
