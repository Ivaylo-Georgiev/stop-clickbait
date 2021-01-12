const sortBy = document.querySelector('#sort-by');
sortBy.addEventListener('change', function () {
    loadArticles(false, this.value);
});

loadArticles(false, 'most-recent');