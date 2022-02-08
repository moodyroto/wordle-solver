//=========================================================
// Script file to clean and format the list of words
//=========================================================

const fs = require('fs');
//const rawWords = require('./dict/raw-words.json');
const _ = require('lodash');
const filteredWords = [];
const letterRankSum = {};
const letterRankLog = {};
const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z'
];

// const allWords = fs
//   .readFileSync('./dict/english_words_10k_mit.txt', 'utf8')
//   .toString()
//   .split(/(?:\r\n|\r|\n)/g);

const allWords = require('./dict/worlde-words.json');

// get the list of five letter words
allWords.forEach(word => {
  if (word.length === 5) {
    filteredWords.push(word);
  }
});

console.log('five letter words length', filteredWords.length);

// calculate the "score" for each letter
// score is a count of every word that contains that letter
// do not double count. eg: "fills" = +1 for L, not +2
//
// calculating both sums and logs as not sure which will to use
alphabet.forEach(letter => {
  const sum = _.sum(filteredWords.map(word => word.indexOf(letter) >= 0 ? 1 : 0));

  letterRankSum[letter] = sum;
  letterRankLog[letter] = Math.log(sum);
});

// calculate word score
const wordSum = {};
const wordLog = {}
filteredWords.forEach(word => {
  const foundLetters = [];
  let sum = 0;

  for(let i = 0; i < word.length; i++) {
    const letter = word[i];


    // not sure if it makes sense to do this. Will need to test both ways
    // but for now, do not score double letters. eg: "fills" only scores FILS
    // will this cause all double letter words to be too low?
    if (foundLetters.indexOf(letter) < 0) {
      foundLetters.push(letter);

      sum += letterRankSum[letter];
    }
  }

  wordSum[word] = sum;
  wordLog[word] = Math.log(sum);
});

// output files
fs.writeFileSync('./dict/letter-rank-sum.json', JSON.stringify(letterRankSum));
fs.writeFileSync('./dict/letter-rank-log.json', JSON.stringify(letterRankLog));
fs.writeFileSync('./dict/word-rank-sum.json', JSON.stringify(wordSum));
fs.writeFileSync('./dict/word-rank-log.json', JSON.stringify(wordLog));
