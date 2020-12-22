const fs = require('fs');

const clickbaitDataSource = 'resources/datasets/clickbait_data';
const nonClickbaitDataSource = 'resources/datasets/non_clickbait_data';

function clean(word) {
    if (word.startsWith('\"') || word.startsWith('\'')) {
        word = word.slice(1, word.length);
    }
    if (word.endsWith('\"') || word.endsWith('\'')) {
        word = word.slice(0, word.length - 1);
    }
    if (word.endsWith(',') || word.endsWith('.')
        || word.endsWith(':') || word.endsWith(';')
        || word.endsWith('!') || word.endsWith('?')) {
        word = word.slice(0, word.length - 1);
    }

    return word;
}

function extractClickbaitData() {
    return fs.promises.readFile(clickbaitDataSource, 'utf8')
        .then(clickbaitData => {
            let clickbaitWordsFrequency = {};
            const words = clickbaitData.toLowerCase().split(/[\n ]+/);
            words.forEach(function (word) {
                word = clean(word);

                if (clickbaitWordsFrequency[word]) {
                    ++clickbaitWordsFrequency[word];
                } else {
                    clickbaitWordsFrequency[word] = 1;
                }
            });

            return clickbaitWordsFrequency;
        });
}

function extractNonClickbaitData() {
    return fs.promises.readFile(nonClickbaitDataSource, 'utf8')
        .then(nonClickbaitData => {
            let nonClickbaitWordsFrequency = {};
            const words = nonClickbaitData.toLowerCase().split(/[\n ]+/);
            words.forEach(function (word) {
                word = clean(word);

                if (nonClickbaitWordsFrequency[word]) {
                    ++nonClickbaitWordsFrequency[word];
                } else {
                    nonClickbaitWordsFrequency[word] = 1;
                }
            });

            return nonClickbaitWordsFrequency;
        });
}

function countWords(wordsData) {
    let wordsCount = 0;
    for (const count of Object.values(wordsData)) {
        wordsCount += count;
    }

    return wordsCount;
}

function calcClickbaitProbability(words, clickbaitFrequency, clickbaitWordsCount, totalWordsCount) {
    let titleClickbaitProbability = 1;
    for (let word of words) {
        word = clean(word);
        if (clickbaitFrequency[word]) {
            let wordClickbaitProbability = clickbaitFrequency[word] / clickbaitWordsCount;
            if (wordClickbaitProbability !== 0) {
                titleClickbaitProbability *= wordClickbaitProbability;
            } else {
                titleClickbaitProbability *= 0.5;
            }
        } else {
            titleClickbaitProbability *= 0.5;
        }
    }

    return titleClickbaitProbability * (clickbaitWordsCount / totalWordsCount);
}


function calcNonClickbaitProbability(words, nonClickbaitFrequency, nonClickbaitWordsCount, totalWordsCount) {
    let titleNonClickbaitProbability = 1;
    for (let word of words) {
        word = clean(word);
        if (nonClickbaitFrequency[word]) {
            let wordNonClickbaitProbability = nonClickbaitFrequency[word] / nonClickbaitWordsCount;
            if (wordNonClickbaitProbability !== 0) {
                titleNonClickbaitProbability *= wordNonClickbaitProbability;
            } else {
                titleNonClickbaitProbability *= 0.5;
            }
        } else {
            titleNonClickbaitProbability *= 0.5;
        }
    }

    return titleNonClickbaitProbability * (nonClickbaitWordsCount / totalWordsCount);
}

function isClickbait(title) {
    const clickbaitData = extractClickbaitData();
    const nonClickbaitData = extractNonClickbaitData();

    return Promise.all([clickbaitData, nonClickbaitData])
        .then(frequencies => {
            const clickbaitFrequency = frequencies[0];
            const nonClickbaitFrequency = frequencies[1];

            const clickbaitWordsCount = countWords(clickbaitFrequency);
            const nonClickbaitWordsCount = countWords(nonClickbaitFrequency);
            const totalWordsCount = clickbaitWordsCount + nonClickbaitWordsCount;

            const words = title.toLowerCase().split(' ');

            let clickbaitProbability = calcClickbaitProbability(words, clickbaitFrequency, clickbaitWordsCount, totalWordsCount);
            let nonClickbaitProbability = calcNonClickbaitProbability(words, nonClickbaitFrequency, nonClickbaitWordsCount, totalWordsCount);

            const probabilities = {
                clickbaitProbability: clickbaitProbability,
                nonClickbaitProbability: nonClickbaitProbability
            }

            return probabilities;
        }).then(probabilities => {
            if (probabilities.clickbaitProbability > probabilities.nonClickbaitProbability) {
                return true;
            }
            return false;
        });
}

module.exports.isClickbait = isClickbait;