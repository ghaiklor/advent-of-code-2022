import fs from "fs";
import path from "path";

const result = fs
  .readFileSync(path.resolve(__dirname, "input.txt"), "utf8")
  .split("\n\n")
  .map((batch) =>
    batch
      .split("\n")
      .map(Number)
      .reduce((a, b) => a + b)
  )
  .sort((a, b) => b - a)[0];

console.log(result);
