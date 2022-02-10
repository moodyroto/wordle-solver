//=========================================================
// Script file to clean and format the list of words
//=========================================================

const fs = require('fs');
const csv = require('csv-parser');
const _ = require('lodash');
//const filteredWords = [];
//const letterRankSum = {};

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

const filteredWords = require('./dict/worlde-words.json');
const MISSING_LEMMA_SCORE = Math.log(70000); //61945

// // get the list of five letter words
// allWords.forEach(word => {
//   if (word.length === 5) {
//     filteredWords.push(word);
//   }
// });

//console.log('five letter words length', filteredWords.length);

const getScoredWords = (commonWords) => {
  const letterRankLog = {};

  // calculate the "score" for each letter
  // score is a count of every word that contains that letter
  // do not double count. eg: "fills" = +1 for L, not +2
  //
  // calculating both sums and logs as not sure which will to use
  alphabet.forEach(letter => {
    const sum = _.sum(filteredWords.map(word => word.indexOf(letter) >= 0 ? 1 : 0));

    //letterRankSum[letter] = sum;
    letterRankLog[letter] = Math.log(sum);
  });

  // calculate word score
  //const wordSum = {};
  const wordLog = {}
  filteredWords.forEach(word => {
    const commonWord = commonWords.find(cw => cw.word === word || cw.word.indexOf(word) >= 0);

    if (commonWord) {
      console.log('common word found for', word);
    }
    const foundLetters = [];
    let letterScore = 0;

    for(let i = 0; i < word.length; i++) {
      const letter = word[i];


      // not sure if it makes sense to do this. Will need to test both ways
      // but for now, do not score double letters. eg: "fills" only scores FILS
      // will this cause all double letter words to be too low?
      if (foundLetters.indexOf(letter) < 0) {
        foundLetters.push(letter);

        letterScore += letterRankLog[letter];
      }
    }

    //wordSum[word] = sum;
    wordLog[word] = Math.log(letterScore) - Math.log(commonWord ? commonWord.score : MISSING_LEMMA_SCORE);
  });

  return wordLog;
  //return {wordSum, wordLog};
};

const getFilteredLemmas = (lemmas) => {
  return lemmas
    .filter(l => l.lemma.length === 5)
    .sort((a, b) => b.score - a.score)
    .map(l => {
      return {
        score: Math.log(l.rank),
        word: l.lemma
      };
    });
};

(() => {
  const csvData = [];

  fs.createReadStream('./dict/lemmas_60k.csv')
    .pipe(csv())
    .on('data', data => csvData.push(data))
    .on('end', () => {
      const lemmas = getFilteredLemmas(csvData);
      const wordLog = getScoredWords(lemmas);

      fs.writeFileSync('./dict/word-rank-log.json', JSON.stringify(wordLog));
    });

  // output files
  // fs.writeFileSync('./dict/letter-rank-sum.json', JSON.stringify(letterRankSum));
  // fs.writeFileSync('./dict/letter-rank-log.json', JSON.stringify(letterRankLog));
  // fs.writeFileSync('./dict/word-rank-sum.json', JSON.stringify(wordSum));
  // fs.writeFileSync('./dict/word-rank-log.json', JSON.stringify(wordLog));
})();