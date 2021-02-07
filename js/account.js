"use strict"

function fetchLogIn(username, password) {
    return fetch('./user/logIn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
}

function logIn(responseText) {
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
}

function fetchSignUp(username, password) {
    return fetch('./user/signUp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    });
}

function signUp(responseText, username, password) {
    if (!JSON.parse(responseText).username) {
        signUpForm.reset();
        let invalidUsernameWarning = document.createElement('p');
        invalidUsernameWarning.classList.add('warning');
        invalidUsernameWarning.innerHTML = `⚠️ Invalid username: ${username} already exists`;
        signUpForm.appendChild(invalidUsernameWarning);
    } else {
        fetchLogIn(username, password)
            .then(getResponseText)
            .then(logIn);
    }
}

function clearWarnings() {
    const warnings = document.querySelectorAll('.warning');
    for (const warning of warnings) {
        warning.remove();
    }
}