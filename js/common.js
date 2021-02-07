"use strict";

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const accessToken = urlParams.get('accessToken');

const headerTitles = document.querySelectorAll('.header-title');

for (const headerTitle of headerTitles) {
    headerTitle.addEventListener('click', scrollToTop);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function getResponseText(response) {
    return response.text()
}