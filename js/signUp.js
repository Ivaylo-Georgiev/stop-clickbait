"use strict";

const signUpForm = document.querySelector('#sign-up-form');

signUpForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.querySelector('#username-input').value;
    const password = document.querySelector('#password-input').value;

    clearWarnings();

    fetchSignUp(username, password)
        .then(getResponseText)
        .then(responseText => signUp(responseText, username, password));
});