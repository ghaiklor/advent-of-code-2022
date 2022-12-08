import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const map = input.split("\n").map((row) => row.split("").map(Number));

let scenicScore = -Infinity;
for (let y = 1; y < map.length - 1; y++) {
  for (let x = 1; x < map[y].length - 1; x++) {
    // check to top
    let treesToTop = 0;
    for (let j = y - 1; j >= 0; j--) {
      treesToTop++;
      if (map[y][x] <= map[j][x]) {
        break;
      }
    }

    // check to bottom
    let treesToBottom = 0;
    for (let j = y + 1; j < map.length; j++) {
      treesToBottom++;
      if (map[y][x] <= map[j][x]) {
        break;
      }
    }

    // check to left
    let treesToLeft = 0;
    for (let j = x - 1; j >= 0; j--) {
      treesToLeft++;
      if (map[y][x] <= map[y][j]) {
        break;
      }
    }

    // check to right
    let treesToRight = 0;
    for (let j = x + 1; j < map[y].length; j++) {
      treesToRight++;
      if (map[y][x] <= map[y][j]) {
        break;
      }
    }

    const score = treesToTop * treesToBottom * treesToLeft * treesToRight;
    scenicScore = score > scenicScore ? score : scenicScore;
  }
}

console.log(scenicScore);
