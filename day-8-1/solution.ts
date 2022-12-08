import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const map = input.split("\n").map((row) => row.split("").map(Number));

let visibleCount = map.length * map[0].length;
for (let y = 1; y < map.length - 1; y++) {
  for (let x = 1; x < map[y].length - 1; x++) {
    // check to top
    let isVisibleFromTop = true;
    for (let j = y - 1; j >= 0; j--) {
      if (map[y][x] <= map[j][x]) {
        isVisibleFromTop = false;
        break;
      }
    }

    // check to bottom
    let isVisibleFromBottom = true;
    for (let j = y + 1; j < map.length; j++) {
      if (map[y][x] <= map[j][x]) {
        isVisibleFromBottom = false;
        break;
      }
    }

    // check to left
    let isVisibleFromLeft = true;
    for (let j = x - 1; j >= 0; j--) {
      if (map[y][x] <= map[y][j]) {
        isVisibleFromLeft = false;
        break;
      }
    }

    // check to right
    let isVisibleFromRight = true;
    for (let j = x + 1; j < map[y].length; j++) {
      if (map[y][x] <= map[y][j]) {
        isVisibleFromRight = false;
        break;
      }
    }

    // only when the tree is not visible from any direction
    // we can decrease the counter
    if (
      !isVisibleFromTop &&
      !isVisibleFromBottom &&
      !isVisibleFromLeft &&
      !isVisibleFromRight
    ) {
      visibleCount--;
    }
  }
}

console.log(visibleCount);
