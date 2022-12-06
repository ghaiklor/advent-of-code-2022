import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const message = fs.readFileSync(file, "utf-8").slice(0, -1);

let result = 0;
for (let x = 0; x < message.length - 13; x++) {
  const marker = message.slice(x, x + 14);

  if (new Set(marker).size === 14) {
    result = x + 14;
    break;
  }
}

console.log(result);
