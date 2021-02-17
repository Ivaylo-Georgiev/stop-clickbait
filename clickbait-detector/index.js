const fs = require('fs');

const clickbaitDataSource = 'resources/datasets/clickbait_data';
const nonClickbaitDataSource = 'resources/datasets/non_clickbait_data';
const stopwordsDataSource = 'resources/datasets/stopwords';

function extractStopwords() {
    return fs.promises.readFile(stopwordsDataSource, 'utf8')
        .then(splitStopwords);
}

function splitStopwords(stopwordsData) {
    return stopwordsData.split('\r\n');
}

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

function extractClickbaitData(stopwords) {
    return fs.promises.readFile(clickbaitDataSource, 'utf8')
        .then(clickbaitData => increaseClickbaitFrequency(clickbaitData, stopwords));
}

function increaseClickbaitFrequency(clickbaitData, stopwords) {
    let clickbaitWordsFrequency = {};
    const words = clickbaitData.toLowerCase().split(/[\n ]+/);
    words.forEach(function (word) {
        if (stopwords.includes(word)) {
            return;
        }

        word = clean(word);

        if (clickbaitWordsFrequency[word]) {
            ++clickbaitWordsFrequency[word];
        } else {
            clickbaitWordsFrequency[word] = 1;
        }
    });

    return clickbaitWordsFrequency;
}

function extractNonClickbaitData(stopwords) {
    return fs.promises.readFile(nonClickbaitDataSource, 'utf8')
        .then(nonClickbaitData => increaseNonClickbaitFrequency(nonClickbaitData, stopwords));
}

function increaseNonClickbaitFrequency(nonClickbaitData, stopwords) {
    let nonClickbaitWordsFrequency = {};
    const words = nonClickbaitData.toLowerCase().split(/[\n ]+/);
    words.forEach(function (word) {
        if (stopwords.includes(word)) {
            return;
        }

        word = clean(word);

        if (nonClickbaitWordsFrequency[word]) {
            ++nonClickbaitWordsFrequency[word];
        } else {
            nonClickbaitWordsFrequency[word] = 1;
        }
    });

    return nonClickbaitWordsFrequency;
}

function countWords(wordsData) {
    let wordsCount = 0;
    for (const count of Object.values(wordsData)) {
        wordsCount += count;
    }

    return wordsCount;
}

function calcClickbaitProbability(words, clickbaitFrequency, nonClickbaitFrequency, clickbaitWordsCount, totalWordsCount) {
    let titleClickbaitProbability = 1;
    for (let word of words) {
        word = clean(word);
        if (clickbaitFrequency[word] && nonClickbaitFrequency[word]) {
            let wordClickbaitProbability = clickbaitFrequency[word] / clickbaitWordsCount;
            titleClickbaitProbability *= wordClickbaitProbability;
        } else {
            continue;
        }
    }

    return titleClickbaitProbability * (clickbaitWordsCount / totalWordsCount);
}

function calcNonClickbaitProbability(words, nonClickbaitFrequency, clickbaitFrequency, nonClickbaitWordsCount, totalWordsCount) {
    let titleNonClickbaitProbability = 1;
    for (let word of words) {
        word = clean(word);
        if (nonClickbaitFrequency[word] && clickbaitFrequency[word]) {
            let wordNonClickbaitProbability = nonClickbaitFrequency[word] / nonClickbaitWordsCount;
            titleNonClickbaitProbability *= wordNonClickbaitProbability;
        } else {
            continue;
        }
    }

    return titleNonClickbaitProbability * (nonClickbaitWordsCount / totalWordsCount);
}

function isClickbait(title) {
    return extractStopwords()
        .then(stopwords => {
            const clickbaitData = extractClickbaitData(stopwords);
            const nonClickbaitData = extractNonClickbaitData(stopwords);

            return Promise.all([clickbaitData, nonClickbaitData])
                .then(frequencies => calcProbabilitiesFromFrequencies(frequencies, title))
                .then(compareProbabilities);
        });
}

function calcProbabilitiesFromFrequencies(frequencies, title) {
    const clickbaitFrequency = frequencies[0];
    const nonClickbaitFrequency = frequencies[1];

    const clickbaitWordsCount = countWords(clickbaitFrequency);
    const nonClickbaitWordsCount = countWords(nonClickbaitFrequency);
    const totalWordsCount = clickbaitWordsCount + nonClickbaitWordsCount;

    const words = title.toLowerCase().split(' ');

    let clickbaitProbability = calcClickbaitProbability(words, clickbaitFrequency, nonClickbaitFrequency, clickbaitWordsCount, totalWordsCount);
    let nonClickbaitProbability = calcNonClickbaitProbability(words, nonClickbaitFrequency, clickbaitFrequency, nonClickbaitWordsCount, totalWordsCount);

    const probabilities = {
        clickbaitProbability: clickbaitProbability,
        nonClickbaitProbability: nonClickbaitProbability
    }

    return probabilities;
}

function compareProbabilities(probabilities) {
    if (probabilities.clickbaitProbability > probabilities.nonClickbaitProbability) {
        return true;
    }
    return false;
}

module.exports.isClickbait = isClickbait;