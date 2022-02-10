const dictionary = require('./dict/word-rank-log.json');
const _ = require('lodash');

const solve = (guesses, results) => {
  const splitRegex = /(?!$)/;
  const dict = getOrderedWords();

  if (!guesses || !results) {
    return dict[0];
  }

  const tries = guesses.map((w, i) => {
    return {
      guess: w.toLowerCase().split(splitRegex),
      result: results[i].split(splitRegex).map(r => parseInt(r))
    }
  });
  const matchLetters = [];
  const foundLetters = [];
  const missedLetters = [];

  // fill out matches
  tries.forEach(t => {
    t.guess.forEach((g, i) => {
      const hit = t.result[i];

      if (hit === 2) {
        matchLetters.push({letter: g, index: i})
      }
    });
  });

  // fill out found
  tries.forEach(t => {
    t.guess.forEach((g, i) => {
      const hit = t.result[i];
      const isMatch = matchLetters.find(m => m.letter === g);

      if (hit === 1 && !isMatch) {
        foundLetters.push({letter: g, index: i});
      }
    });
  });

  // fill out misses
  tries.forEach(t => {
    t.guess.forEach((g, i) => {
      const hit = t.result[i];
      const isMatch = matchLetters.find(m => m.letter === g);
      const isFound = foundLetters.find(m => m.letter === g);

      if (hit === 0 && !isMatch && !isFound) {
        missedLetters.push(g);
      }
    });
  });

  return dict.find(d => {
    const testWord = d.word;
    let isNextWord = true;

    for(let i = 0; i < matchLetters.length && isNextWord; i++) {
      const matchLetter = matchLetters[i];
      const corrispondingLetter = testWord[matchLetter.index]
      //const matchIndex = testWord.indexOf(matchLetter.letter);

      if (corrispondingLetter !== matchLetter.letter) {
        isNextWord = false;
        continue;
      }
    }

    for(let i = 0; i < foundLetters.length && isNextWord; i++) {
      const foundLetter = foundLetters[i];
      const foundIndex = testWord.indexOf(foundLetter.letter);

      if (foundIndex < 0) {
        isNextWord = false;
        continue;
      } else if (foundIndex === foundLetter.index) {
        isNextWord = false;
        continue;
      }
    }

    for(let i = 0; i < testWord.length && isNextWord; i++) {
      const letter = testWord[i];

      if (missedLetters.indexOf(letter) >= 0) {
        isNextWord = false;
        continue;
      }
    }

    return isNextWord;
  });
}


const getOrderedWords = () => {
  return _
    .map(dictionary, (v, k) => {
      return {word: k, score: v};
    })
    .sort((a, b) => b.score - a.score);
}

module.exports = solve;