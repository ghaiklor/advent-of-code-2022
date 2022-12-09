import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const moves = input.split("\n").map((m) => m.split(" "));
const head = { x: 0, y: 0 };
const tail = { x: 0, y: 0 };
const visited = new Set<string>([`(${tail.x}, ${tail.y})`]);

for (const move of moves) {
  const direction = move[0];
  const count = parseInt(move[1], 10);

  for (let i = count; i > 0; i--) {
    // move the head
    if (direction === "U") head.y++;
    if (direction === "D") head.y--;
    if (direction === "L") head.x--;
    if (direction === "R") head.x++;

    // check if tail is nearby
    // ..T .T. ... .H.
    // .H. .H. .H. ..T
    // ... ... .T. ...
    if (
      tail.x >= head.x - 1 &&
      tail.x <= head.x + 1 &&
      tail.y >= head.y - 1 &&
      tail.y <= head.y + 1
    ) {
      // tail is nearby but do nothing with it
      // maybe there will be some task with it in part II
    } else {
      // we need to move tail closer to the head
      if (head.x === tail.x) {
        tail.y += head.y < tail.y ? -1 : 1;
      } else if (head.y === tail.y) {
        tail.x += head.x > tail.x ? 1 : -1;
      } else {
        tail.x += head.x > tail.x ? 1 : -1;
        tail.y += head.y < tail.y ? -1 : 1;
      }
    }

    visited.add(`(${tail.x}, ${tail.y})`);
  }
}

console.log(visited.size);
