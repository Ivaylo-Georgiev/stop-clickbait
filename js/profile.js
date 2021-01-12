const feedLink = document.querySelector('#feed-link');
feedLink.setAttribute('href', '/user/feed?username=' + username + '&accessToken=' + accessToken);

loadArticles(true);
