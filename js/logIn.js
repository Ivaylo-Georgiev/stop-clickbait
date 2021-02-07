"use strict";

const logInForm = document.querySelector('#log-in-form');

logInForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.querySelector('#username-input').value;
    const password = document.querySelector('#password-input').value;

    clearWarnings();

    fetchLogIn(username, password)
        .then(getResponseText)
        .then(logIn);
});