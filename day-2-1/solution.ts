import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
const rounds = input
  .split("\n")
  .map((i) => i.split(" "))
  .slice(0, -1);

const shapeToScore: Record<string, number> = { X: 1, Y: 2, Z: 3 };

let score = 0;
for (const round of rounds) {
  const [opponentShape, myShape] = round;

  score += shapeToScore[myShape] ?? 0;

  if (
    (opponentShape === "A" && myShape === "Z") ||
    (opponentShape === "C" && myShape === "Y") ||
    (opponentShape === "B" && myShape === "X")
  ) {
    score += 0;
  } else if (
    (opponentShape === "C" && myShape === "X") ||
    (opponentShape === "B" && myShape === "Z") ||
    (opponentShape === "A" && myShape === "Y")
  ) {
    score += 6;
  } else {
    score += 3;
  }
}

console.log(score);
