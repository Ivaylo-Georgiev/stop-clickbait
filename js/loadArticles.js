window.onload = function (event) {
    fetch('/article/all', {
        method: 'GET'
    }).then(response => {
        return response.text()
            .then(function (responseText) {
                renderArticles(JSON.parse(responseText));

                // mark voted articles for logged user
                if (accessToken !== 'null' && username != 'null' && accessToken && username) {
                    fetch('/user/votedArticleIdsForUser?username=' + username + '&accessToken=' + accessToken, {
                        method: 'GET'
                    }).then(response => {
                        return response.text()
                            .then(function (responseText) {
                                const ids = JSON.parse(responseText);

                                for (const articleId of ids.articleIds) {
                                    const article = document.querySelector('#articleID' + articleId + ' .votes');
                                    article.classList.add('voted');
                                }
                            });
                    });
                }
            });
    });
}

function renderArticles(articles) {
    for (const articleData of articles) {
        let articlesContainer = document.querySelector('#articles-container');

        let article = document.createElement('div');
        article.id = 'articleID' + articleData._id;
        article.classList.add('article');

        let articleImg = document.createElement('img');
        articleImg.setAttribute('src', articleData.imgAddress);

        let articleTitle = document.createElement('h3');
        articleTitle.classList.add('article-title');
        articleTitle.innerHTML = articleData.title;

        let articleReveal = document.createElement('p');
        articleReveal.classList.add('article-reveal');
        articleReveal.innerHTML = '<span>Reveal by ' + articleData.revealedBy + ': </span>' + articleData.reveal;

        let articleMeta = document.createElement('div');
        articleMeta.classList.add('article-meta');

        let articleSourceParagraph = document.createElement('p');
        articleSourceParagraph.innerHTML = 'Source: ';
        let articleSource = document.createElement('a');
        articleSource.innerHTML = articleData.source;
        articleSource.setAttribute('href', articleData.uri);
        articleSource.setAttribute('target', '_blank');
        articleSource.classList.add('source-link');
        articleSourceParagraph.appendChild(articleSource);

        let articleVotes = document.createElement('p');
        articleVotes.innerHTML = articleData.votes + '&#9733;';
        articleVotes.classList.add('votes');
        articleVotes.addEventListener('click', function (event) {
            fetch('/article/vote?username=' + username + '&accessToken=' + accessToken, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    articleId: articleData._id
                })
            }).then(response => {
                if (response.status === 200) {
                    return response.text()
                        .then(function (responseText) {
                            const updatedVotes = JSON.parse(responseText).votes;
                            articleVotes.innerHTML = JSON.parse(responseText).votes + '&#9733;';
                            if (articleData.votes < updatedVotes) {
                                articleVotes.classList.add('voted');
                            } else {
                                articleVotes.classList.remove('voted');
                            }
                        });
                } else if (response.status === 401) {
                    window.location.href = '/unauthorized';
                } else if (response.status === 403) {
                    window.location.href.href = '/fobidden';
                }
            });
        })

        articleMeta.appendChild(articleVotes);
        articleMeta.appendChild(articleSourceParagraph);
        article.appendChild(articleImg);
        article.appendChild(articleTitle);
        article.appendChild(articleMeta);
        article.appendChild(articleReveal);

        articlesContainer.appendChild(article);
    }
}