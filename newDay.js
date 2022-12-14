const fs = require('fs');
const path = require('path');

let day = process.argv[2];
fs.mkdirSync(day, (e, p) => {});
fs.writeFileSync(path.join(day, `${day}.ts`), '');
fs.writeFileSync(path.join(day, 'input.txt'), '');
fs.writeFileSync(path.join(day, 'puzzle.md'), '');