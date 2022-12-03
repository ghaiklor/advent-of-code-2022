import fs from "fs";
import path from "path";

const input = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");
const rucksacks = input.split("\n").slice(0, -1);

let result = 0;
for (
  let i = 0, j = i + 1, k = j + 1;
  i < rucksacks.length;
  i += 3, j += 3, k += 3
) {
  const firstRucksack = rucksacks[i].split("");
  const secondRucksack = rucksacks[j].split("");
  const thirdRucksack = rucksacks[k].split("");
  const common = firstRucksack.filter(
    (i) => secondRucksack.includes(i) && thirdRucksack.includes(i)
  )[0];

  const code = common[0].charCodeAt(0);
  const priority = code > 96 ? code - 96 : code - 38;

  result += priority;
}

console.log(result);
