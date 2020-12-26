const revealClickbaitForm = document.querySelector('#reveal-clickbait-form');

revealClickbaitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const address = document.querySelector('#article-link').value;
    const shortReveal = document.querySelector('#clickbait-reveal').value;
    console.log(username);
    fetch('/article/parse', {
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
    }).then(response => {
        return response.text()
            .then(function (responseText) {
                fetch('/article/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: responseText
                }).then(response => {
                    window.location.href = '/user/feed?username=' + username + '&accessToken=' + accessToken;
                })
            });
    });
});
