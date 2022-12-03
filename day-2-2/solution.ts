import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
const rounds = input
  .split("\n")
  .map((i) => i.split(" "))
  .slice(0, -1);

let score = 0;
for (const round of rounds) {
  const [opponentShape, desiredStatus] = round;

  switch (`${opponentShape}${desiredStatus}`) {
    case "AX":
      score += 0 + 3;
      break;
    case "BX":
      score += 0 + 1;
      break;
    case "CX":
      score += 0 + 2;
      break;
    case "AY":
      score += 3 + 1;
      break;
    case "BY":
      score += 3 + 2;
      break;
    case "CY":
      score += 3 + 3;
      break;
    case "AZ":
      score += 6 + 2;
      break;
    case "BZ":
      score += 6 + 3;
      break;
    case "CZ":
      score += 6 + 1;
      break;
  }
}

console.log(score);
