let exposeClickbaitForm = document.querySelector('#expose-clickbait-form');

exposeClickbaitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let address = document.querySelector('#expose-clickbait-form input[type=text]').value;
    fetch('./article/fromSource', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ uri: address })
    }).then(response => {
        return response.text()
            .then(function (responseText) {
                fetch('./article/insert', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: responseText
                })
            });
    });
});