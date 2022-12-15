import fs from "fs";
import path from "path";

type Point = { x: number; y: number };

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const data: Array<[Point, Point, number]> = [];

for (const definition of input) {
  const [_, sensorX, sensorY, beaconX, beaconY] = definition.match(
    /Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/
  )!;

  const sensor: Point = { x: +sensorX, y: +sensorY };
  const beacon: Point = { x: +beaconX, y: +beaconY };
  const d = Math.abs(sensor.x - beacon.x) + Math.abs(sensor.y - beacon.y);
  data.push([sensor, beacon, d]);
}

for (let y = 0; y <= 4000000; y++) {
  for (let x = 0; x <= 4000000; x++) {
    let isPointInsideOfSensors = false;

    for (let i = 0; i < data.length; i++) {
      const [sensor, _, distance] = data[i];

      if (Math.abs(sensor.x - x) + Math.abs(sensor.y - y) <= distance) {
        isPointInsideOfSensors = true;
        x = sensor.x + distance - Math.abs(sensor.y - y);
        break;
      }
    }

    if (!isPointInsideOfSensors) {
      console.log(`(${x}, ${y}) -> ${x * 4000000 + y}`);
    }
  }
}
