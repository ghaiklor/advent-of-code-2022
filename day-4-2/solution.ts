import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const assignments = input.split("\n").map((i) => i.split(","));

let result = 0;
for (const assignment of assignments) {
  const firstPair = assignment[0].split("-").map(Number);
  const secondPair = assignment[1].split("-").map(Number);
  const startX = firstPair[0];
  const endX = firstPair[1];
  const startY = secondPair[0];
  const endY = secondPair[1];

  if (endX >= startY && startX <= endY) {
    result++;
  }
}

console.log(result);
