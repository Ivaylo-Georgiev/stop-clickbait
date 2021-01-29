"use strict";

const logInForm = document.querySelector('#log-in-form');

logInForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.querySelector('#username-input').value;
    const password = document.querySelector('#password-input').value;

    const warnings = document.querySelectorAll('.warning');
    for (const warning of warnings) {
        warning.remove();
    }

    fetch('./user/logIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(response => {
        return response.text()
            .then(function (responseText) {
                const username = JSON.parse(responseText).username;
                const accessToken = JSON.parse(responseText).accessToken;
                if (accessToken) {
                    window.location.replace('/user/feed?username=' + username + '&accessToken=' + accessToken);
                } else {
                    logInForm.reset();
                    let invalidUsernameOrPasswordWarning = document.createElement('p');
                    invalidUsernameOrPasswordWarning.classList.add('warning');
                    invalidUsernameOrPasswordWarning.innerHTML = `⚠️ Invalid username or password`;
                    logInForm.appendChild(invalidUsernameOrPasswordWarning);
                }
            });
    });
});