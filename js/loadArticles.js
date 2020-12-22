window.onload = function (event) {
    fetch('./article/all', {
        method: 'GET'
    }).then(response => {
        return response.text()
            .then(function (responseText) {
                renderArticles(JSON.parse(responseText));
            });
    });
}

function renderArticles(articles) {
    for (const articleData of articles) {
        let articlesContainer = document.querySelector('#articles-container');

        let article = document.createElement('div');
        article.classList.add('article');

        let articleImg = document.createElement('img');
        articleImg.setAttribute('src', articleData.imgAddress);

        let articleTitle = document.createElement('h3');
        articleTitle.classList.add('article-title');
        articleTitle.innerHTML = articleData.title;

        let articleReveal = document.createElement('p');
        articleReveal.classList.add('article-reveal');
        articleReveal.innerHTML = '<span>Reveal: </span>' + articleData.reveal;

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

        articleMeta.appendChild(articleVotes);
        articleMeta.appendChild(articleSourceParagraph);
        article.appendChild(articleImg);
        article.appendChild(articleTitle);
        article.appendChild(articleMeta);
        article.appendChild(articleReveal);

        articlesContainer.appendChild(article);
    }
}