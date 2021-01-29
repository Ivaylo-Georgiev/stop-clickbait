"use strict";

const headerTitles = document.querySelectorAll('.header-title');

for (const headerTitle of headerTitles) {
    headerTitle.addEventListener('click', function (event) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}