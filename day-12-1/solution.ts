import fs from "fs";
import path from "path";

type Point = { x: number; y: number };

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1);
const mapWidth = input.split("\n")[0].length;

// Map here is already processed into a map of heights
const map = input
  .replaceAll("S", "a")
  .replaceAll("E", "z")
  .split("\n")
  .map((i) => i.split("").map((i) => i.charCodeAt(0) - 97));

// Looking for a start point
const start: Point = {
  x: input.replaceAll("\n", "").indexOf("S") % mapWidth,
  y: Math.floor(input.replaceAll("\n", "").indexOf("S") / mapWidth),
};

// Looking for an end point
const end: Point = {
  x: input.replaceAll("\n", "").indexOf("E") % mapWidth,
  y: Math.floor(input.replaceAll("\n", "").indexOf("E") / mapWidth),
};

let id = (point: Point) => `(${point.x}, ${point.y})`;
let visited: Set<string> = new Set();
let foundPaths: Array<Array<Point>> = [];
let queue: Array<{ point: Point; path: Array<Point> }> = [
  { path: [], point: { x: start.x, y: start.y } },
];

while (queue.length > 0) {
  const { path, point } = queue.shift()!;

  // If we are already at the end point we can break the loop, the path is found
  if (point.x === end.x && point.y === end.y) {
    foundPaths.push(path);
    break;
  }

  // Or, if we already been here, just skip this iteration
  if (visited.has(id(point))) {
    continue;
  }

  // Points we can go to
  const neighbors: Array<Point> = [
    { x: point.x - 1, y: point.y },
    { x: point.x + 1, y: point.y },
    { x: point.x, y: point.y - 1 },
    { x: point.x, y: point.y + 1 },
  ];

  // But not all of them are traversable, because of height threshold
  const candidates = neighbors.filter(
    (p) => map[p.y] && map[p.y][p.x] <= map[point.y][point.x] + 1
  );

  // Add candidates to the queue with the path they've been through
  queue = queue.concat(
    candidates.map((p) => ({
      point: p,
      path: path.concat([{ x: point.x, y: point.y }]),
    }))
  );

  visited.add(id(point));
}

foundPaths.forEach((p) => console.log(p.length));
