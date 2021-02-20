const dontClick = document.querySelector('#dont');
const doClick = document.querySelector('#do');

dontClick.addEventListener('click', checkLink);
doClick.addEventListener('click', checkLink);

function checkLink(event) {
    event.preventDefault();
    var targetElement = event.target;
    fetch('/parse', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            uri: targetElement.href
        })
    }).then(res => res.text().then(text => {
        fetch('/isClickbait', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                title: JSON.parse(text).title
            })
        }).then(res => res.text().then(text => {
            if (text === 'true') {
                alert('This link is identified as a clickbait. You cannot open it.')
            } else {
                window.open(event.target.href, '_blank');
            }
        }))
    }))
}