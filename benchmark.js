const babar = require('babar');
const benchmarkWords = require('./dict/wordle-benchmark.json');
const solver = require('./solver.js');
const MAX_GUESS_COUNT = 6;

const getWordMatch = (guess, answer) => {
  const results = [];

  for(let i = 0; i < guess.length; i++) {
    let result = 0;
    const letter = guess[i];
    const letterCount = getLetterCount(letter, answer);
    const foundIndex = answer.indexOf(letter);

    if (letter === answer[i]) {
      result = 2;
    } else if  (letterCount > 1 && foundIndex >= 0) {
      result = 1;
    } else if (foundIndex >= 0 && guess[foundIndex] !== answer[foundIndex]) {
      result = 1;
    }

    results.push(result);
  }

  return results;
};

const getLetterCount = (letter, word) => {
  let count = 0;

  for(let i = 0; i < word.length; i++) {
    count += word[i] === letter ? 1 : 0;
  }

  return count;
};

const getSolveCount = (answer) => {
  const guesses = [];
  const results = [];


  for(let i = 0; i < MAX_GUESS_COUNT; i++) {
    // console.log('index: ', i);
    // console.log('guesses', guesses);
    // console.log('results', results);
    const suggestion = solver(guesses, results).word;

    // console.log(`${i} guess: `, suggestion)

    if (suggestion === answer) {
      //console.log(`solved ${answer} in ${i + 1} guesses.`);
      return i;
    }

    guesses.push(suggestion);
    results.push(getWordMatch(suggestion, answer).join(''));
  }

  //console.log('Did not solve', answer);
  return MAX_GUESS_COUNT;
};

(() => {
  const results = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0
  };
  const benchmarkLength = benchmarkWords.length;
  for(let i = 0; i < benchmarkLength; i++) {
    console.log(`Calculating ${i} of ${benchmarkLength}`);

    const result = getSolveCount(benchmarkWords[i]);
    results[result]++;
  }

  console.log(babar([
    [1, results['0']],
    [2, results['1']],
    [3, results['2']],
    [4, results['3']],
    [5, results['4']],
    [6, results['5']],
    [7, results['6']]
  ], {height: 29}));
})();