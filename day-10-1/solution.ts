import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const instructions = input.split("\n").map((i) => i.split(" "));

let cycle = 0;
let registerX = 1;
let signalStrength = 0;
let intOnCycle = 20;
for (const instruction of instructions) {
  const [kind, op1] = instruction;

  switch (kind) {
    case "noop":
      if (cycle === intOnCycle || cycle + 1 === intOnCycle) {
        signalStrength = signalStrength + intOnCycle * registerX;
        intOnCycle += 40;
      }

      cycle += 1;
      break;
    case "addx":
      if (
        cycle === intOnCycle ||
        cycle + 1 === intOnCycle ||
        cycle + 2 === intOnCycle
      ) {
        signalStrength = signalStrength + intOnCycle * registerX;
        intOnCycle += 40;
      }

      cycle += 2;
      registerX += parseInt(op1, 10);
      break;
  }
}

console.log(signalStrength);
