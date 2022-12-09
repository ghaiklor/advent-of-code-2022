import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const moves = input.split("\n").map((m) => m.split(" "));
const visited = new Set<string>([`(0, 0)`]);
const knots = [
  { x: 0, y: 0 }, // head
  { x: 0, y: 0 }, // 1
  { x: 0, y: 0 }, // 2
  { x: 0, y: 0 }, // 3
  { x: 0, y: 0 }, // 4
  { x: 0, y: 0 }, // 5
  { x: 0, y: 0 }, // 6
  { x: 0, y: 0 }, // 7
  { x: 0, y: 0 }, // 8
  { x: 0, y: 0 }, // tail
];

for (const move of moves) {
  const direction = move[0];
  const count = parseInt(move[1], 10);

  for (let i = count; i > 0; i--) {
    // move the head
    if (direction === "U") knots[0].y++;
    if (direction === "D") knots[0].y--;
    if (direction === "L") knots[0].x--;
    if (direction === "R") knots[0].x++;

    // check if knots is nearby and re-arrange them if so
    for (let knotIndex = 0; knotIndex < knots.length - 1; knotIndex++) {
      const head = knots[knotIndex];
      const tail = knots[knotIndex + 1];

      if (
        tail.x >= head.x - 1 &&
        tail.x <= head.x + 1 &&
        tail.y >= head.y - 1 &&
        tail.y <= head.y + 1
      ) {
      } else {
        if (head.x === tail.x) {
          tail.y += head.y < tail.y ? -1 : 1;
        } else if (head.y === tail.y) {
          tail.x += head.x > tail.x ? 1 : -1;
        } else {
          tail.x += head.x > tail.x ? 1 : -1;
          tail.y += head.y < tail.y ? -1 : 1;
        }
      }
    }

    visited.add(`(${knots[knots.length - 1].x}, ${knots[knots.length - 1].y})`);
  }
}

console.log(visited.size);
