const feedLink = document.querySelector('#feed-link');
feedLink.setAttribute('href', '/user/feed?username=' + username + '&accessToken=' + accessToken);

const sortBy = document.querySelector('#sort-by');
sortBy.addEventListener('change', function () {
    loadArticles(true, this.value);
});

loadArticles(true, 'most-recent');
