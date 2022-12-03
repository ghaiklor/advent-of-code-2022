import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
const rucksacks = input.split("\n").slice(0, -1);

let result = 0;
for (const rucksack of rucksacks) {
  const leftCompartment = rucksack.slice(0, rucksack.length / 2).split("");
  const rightCompartment = rucksack.slice(rucksack.length / 2).split("");
  const common = rightCompartment.filter((i) => leftCompartment.includes(i))[0];
  const code = common.charCodeAt(0);
  const priority = code > 96 ? code - 96 : code - 38;

  result += priority;
}

console.log(result);
