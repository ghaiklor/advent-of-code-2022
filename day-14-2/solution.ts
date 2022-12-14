import fs from "fs";
import path from "path";

type Item = "ROCK" | "AIR" | "SAND";
type Point = [x: number, y: number];

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const id = (x: number, y: number) => `(${x}, ${y})`;
const map: Map<string, Item> = new Map();

// Parse the input and fill the map
let maxY = -Infinity;
for (const path of input) {
  const chunks = path.split(" -> ");

  for (let i = 0, j = 1; i < chunks.length - 1; i++, j++) {
    let [currentX, currentY] = chunks[i].split(",").map(Number) as Point;
    let [nextX, nextY] = chunks[j].split(",").map(Number) as Point;

    maxY = currentY > maxY ? currentY : maxY;

    while (currentX !== nextX) {
      map.set(id(currentX, currentY), "ROCK");
      currentX = currentX > nextX ? currentX - 1 : currentX + 1;
      map.set(id(currentX, currentY), "ROCK");
    }

    while (currentY !== nextY) {
      map.set(id(currentX, currentY), "ROCK");
      currentY = currentY > nextY ? currentY - 1 : currentY + 1;
      map.set(id(currentX, currentY), "ROCK");
    }

    maxY = currentY > maxY ? currentY : maxY;
  }
}

// Emulating sand
// (500, 0) is the starting point of the sand so initializing it here
let [sandX, sandY]: Point = [500, 0];
let counter = 0;
while (true) {
  let itemBelow = map.get(id(sandX, sandY + 1));
  let itemToTheLeft = map.get(id(sandX - 1, sandY + 1));
  let itemToTheRight = map.get(id(sandX + 1, sandY + 1));

  // If we are at floor, override the info from scanner
  if (sandY === maxY + 1) {
    itemBelow = "ROCK";
    itemToTheLeft = "ROCK";
    itemToTheRight = "ROCK";
  }

  // Afterwards check for surrounding items and look for free space for sand
  if (itemBelow !== "ROCK" && itemBelow !== "SAND") {
    // sand can drop down
    [sandX, sandY] = [sandX, sandY + 1];
    continue;
  } else if (itemToTheLeft !== "ROCK" && itemToTheLeft !== "SAND") {
    // sand can drop to the left
    [sandX, sandY] = [sandX - 1, sandY + 1];
    continue;
  } else if (itemToTheRight !== "ROCK" && itemToTheRight !== "SAND") {
    // sand can drop to the right
    [sandX, sandY] = [sandX + 1, sandY + 1];
    continue;
  } else {
    // sand is blocked, meaning we set it as a sand item on the map and starting again
    map.set(id(sandX, sandY), "SAND");
    counter++;

    // break the loop if we are at the spawning point of the sand
    if (sandX === 500 && sandY === 0) {
      break;
    }

    [sandX, sandY] = [500, 0];
    continue;
  }
}

console.log(counter);
