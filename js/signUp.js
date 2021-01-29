"use strict";

const signUpForm = document.querySelector('#sign-up-form');

signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.querySelector('#username-input').value;
    const password = document.querySelector('#password-input').value;

    const warnings = document.querySelectorAll('.warning');
    for (const warning of warnings) {
        warning.remove();
    }

    fetch('./user/signUp', {
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
                if (!JSON.parse(responseText).username) {
                    signUpForm.reset();
                    let invalidUsernameWarning = document.createElement('p');
                    invalidUsernameWarning.classList.add('warning');
                    invalidUsernameWarning.innerHTML = `⚠️ Invalid username: ${username} already exists`;
                    signUpForm.appendChild(invalidUsernameWarning);
                } else {
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
                                window.location.replace('/user/feed?username=' + username + '&accessToken=' + accessToken);
                            });
                    });
                }
            });
    });
}) 