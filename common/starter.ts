import { exec } from "child_process";
import path from "path";

const day = process.argv[2];
const puzzle = path.join('dist', day, `${day}.js`);

exec(`node ${puzzle} ${day} ${process.argv.slice(3).join(' ')}`, (ex, out, err) => {
    if (out) {
        console.log(out);
    }
    if (err) {
        console.error(err);
    }
});