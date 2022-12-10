import fs from "fs";
import path from "path";

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const instructions = input.split("\n").map((i) => i.split(" "));
const display = new Array(6).fill(0).map((_) => new Array(40).fill("."));

/**
 * Render the pixel on the CRT display according to the peripherals rules.
 * Sprite is 3 pixels long, so we detect if current CRT pixel is in the sprite.
 *
 * @param display Pointer to the CRT display where the rendering is happening
 * @param cycle Cycle counter to indicate on which CPU cycle we are on right now
 * @param regX The value from the register X
 */
function render(display: Array<Array<string>>, cycle: number, regX: number) {
  const x = cycle % 40;
  const y = Math.floor(cycle / 40);
  display[y][x] = x >= regX - 1 && x <= regX + 1 ? "#" : ".";
}

let cycle = 0;
let registerX = 1;

// I chose instruction-first because it is simpler, personally
// In a real world I'd choose cycle-first to better emulate the clock
// But since we have only two commands it's easier to handle cycles as duplicate code
for (const instruction of instructions) {
  const [kind, op1] = instruction;

  switch (kind) {
    case "noop":
      // For no-operation we spend a single cycle
      // So render the current pixel, increment the cycle
      render(display, cycle, registerX);
      cycle += 1;

      break;
    case "addx":
      // For add operation, however, we need to spend two cycles
      // So I'm rendering the first pixel for the current cycle
      render(display, cycle, registerX);
      cycle += 1;

      // Afterwards, I'm rendering another one pixel for another cycle
      render(display, cycle, registerX);
      cycle += 1;

      // And only after two cycles we can increment the register
      registerX += parseInt(op1, 10);
      break;
  }
}

console.log(display.map((row) => row.join("")).join("\n"));
