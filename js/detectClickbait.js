"use strict";

let detectClickbaitForm = document.querySelector('#detect-clickbait-form');

detectClickbaitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    let title = document.querySelector('#detect-clickbait-form input[type=text]').value;

    fetch('./article/isClickbait', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ title: title })
    })
        .then(getResponseText)
        .then(responseText => displayDetectionResults(title, responseText === 'true'));
});


function displayDetectionResults(title, isClickbait) {
    detectClickbaitForm.remove();
    let detectClickbaitContainer = document.querySelector('#detect-clickbait-container');
    let textContainer = document.createElement('div');
    textContainer.classList.add('text-container');
    let titleH1 = document.createElement('h1');
    titleH1.innerHTML = title;
    let detectionResultH2 = document.createElement('h2');
    if (isClickbait) {
        detectionResultH2.innerHTML = '✅ Sounds a lot like a clickbait';
        detectionResultH2.classList.add('green');
    } else {
        detectionResultH2.innerHTML = '❌ Doesn\'t really sound like a clickbait';
        detectionResultH2.classList.add('red');
    }
    let detectAnotherTitleButton = document.createElement('a');
    detectAnotherTitleButton.classList.add('button');
    detectAnotherTitleButton.id = 'detect-button';
    detectAnotherTitleButton.innerHTML = 'Detect another title';
    detectAnotherTitleButton.setAttribute('href', './detectClickbait');
    textContainer.appendChild(titleH1);
    textContainer.appendChild(detectionResultH2);
    detectClickbaitContainer.appendChild(textContainer);
    detectClickbaitContainer.appendChild(detectAnotherTitleButton);
}