import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n\n");
const arrangement = input[0].split("\n");
const moves = input[1].split("\n");
const field: Array<string[]> = new Array(9).fill(0).map(() => new Array());

for (let stackId = 1; stackId <= 9; stackId++) {
  for (let row = arrangement.length - 2; row >= 0; row--) {
    const rawBox = arrangement[row]
      .slice((stackId - 1) * 4, (stackId - 1) * 4 + 3)
      .match(/\[([A-Z])\]/);

    if (rawBox === null) {
      continue;
    }

    const box = rawBox[1];
    field[stackId - 1].push(box);
  }
}

for (const move of moves) {
  const parsed = move.match(/move (\d+) from (\d+) to (\d+)/);
  if (parsed === null) {
    continue;
  }

  let [_, count, from, to] = parsed.map(Number);

  for (count; count > 0; count--) {
    const box = field[from - 1].pop();
    if (box === undefined) {
      continue;
    }

    field[to - 1].push(box);
  }
}

const topBoxes = field.reduce((acc, b) => acc.concat(b[b.length - 1]), []);
console.log(topBoxes.join(""));
