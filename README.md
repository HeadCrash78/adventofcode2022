# Advent Of Code 2022
Welcome to my repository for the **[Advent of code 2022](https://adventofcode.com/2022)**! I'm solving the programming puzzles using [TypeScript](https://www.typescriptlang.org/).

## Building and Running The Puzzles
Before you start, install all requisites ([Node.js](https://nodejs.org) and [TypeScript](https://www.typescriptlang.org/)) on your machine manually. As an easy alternative, use [Visual Studio Code](https://code.visualstudio.com) and the [Remote Development Extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) together with [Docker](https://www.docker.com/) to build and run the code in a development container (recommended).

Once your development container is running (or your machine is set up), run `npm install` in the repository root to install all necessary npm packages, then run `npm run build` to transpile all TypeScript files. The results are generated in the `dist` folder.

To run a puzzle, simply run `npm start {day}` (e.g., `npm start day5`).

Some puzzles support verbose output (e.g., the rope puzzle from day 9). To see verbose output, add the argument `verbose` when you run the puzzle (e.g., `npm start day9 verbose`);

The following puzzles support verbose output:
- day9
- day12
- day13
- day14
- day15 (only with small fields, e.g., the test data)

Have fun! :metal:
