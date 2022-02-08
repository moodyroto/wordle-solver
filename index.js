//const dictionary = require('./dict/word-rank-sum.json');
const commandLineArgs = require('command-line-args');
const solver = require('./solver');
// guesses = comma delimited list of words used
// -g arise,count,pules
//
// results = commad delimited list of where 0 = not found, 1 = found, 2 = found in right location
// -r 00011,00100,02021
const argDefs = [
  {name: 'guesses', alias: 'g', type: String},
  {name: 'results', alias: 'r', type: String}
];
const options = commandLineArgs(argDefs);
const guesses = options.guesses ? options.guesses.split(',') : '';
const results = options.results ? options.results.split(',') : '';

// if (guesses.legnth !== results.legnth) {
//   console.error('Invalid input. Input list does not match.');
//   return;
// }

const result = solver(guesses, results);

console.log('NEXT GUESS: ', result);
