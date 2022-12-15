import fs from "fs";
import path from "path";

type Point = { x: number; y: number };

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const map: Map<number, [number, number]> = new Map();

for (const definition of input) {
  const [_, sensorX, sensorY, beaconX, beaconY] = definition.match(
    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
  )!;

  const sensor: Point = { x: +sensorX, y: +sensorY };
  const beacon: Point = { x: +beaconX, y: +beaconY };
  const d = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);

  for (
    let x = sensor.x, y = sensor.y - d;
    y <= sensor.y + d;
    y < sensor.y ? x-- : x++, y++
  ) {
    const w = Math.abs((y < sensor.y ? sensor.y - d : sensor.y + d) - y) * 2;
    const x0 = x;
    const x1 = x + w;
    const [start, end] = map.get(y) ?? [Infinity, -Infinity];

    map.set(y, [x0 < start ? x0 : start, x1 > end ? x1 : end]);
  }
}

const [start, end] = map.get(2000000)!;
console.log(Math.abs(start) + Math.abs(end));
