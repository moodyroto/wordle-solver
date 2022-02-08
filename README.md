# wordle-solver

Simple Wordle Solver written in node

![Solver example image!](/img/wordle-solve.gif "Solver example image")


## Pre-requisites

- Node v15 (probably works with older version, but have not tested)

## Example Usage

```shell
$ node index.js -g aeros,sluit,sting -r 00001,20011,22220
```

## Arguments

| Command    | Description                         |
|------------|-------------------------------------|
| -g         | Comma separated list of guesses.    |
| -r         | Comma separated list of results, where 0 = not found, 1 = found in the wrong location, 2 = found in the correct location. |