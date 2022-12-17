import fs from "fs";
import path from "path";

type Valve = {
  id: string;
  rate: number;
  neighbors: Array<Valve["id"]>;
};

const file = path.resolve(__dirname, "test.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const valves: Map<Valve["id"], Valve> = new Map();

// Parsing info about valves
for (const valve of input) {
  const [_, id, rate, neighbors] = valve.match(
    /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)$/
  )!;

  valves.set(id, {
    id,
    rate: parseInt(rate, 10),
    neighbors: neighbors.split(", "),
  });
}

// Finding the optimal path for all valves and make a map for all combinations
// This will help to get an optimal path in O(1) later
let start = "AA";
let queue: Array<Valve["id"]> = Array.from(valves.keys());
let hops: Record<Valve["id"], Valve["id"]> = {};
let minutes: Record<Valve["id"], number> = { [start]: 30 };
let pressure: Record<Valve["id"], number> = { [start]: 0 };
let weights: Record<Valve["id"], number> = {
  [start]: valves.get(start)!.rate * minutes[start],
};

while (queue.length > 0) {
  queue.sort((a, b) => (pressure[b] ?? -Infinity) - (pressure[a] ?? -Infinity));

  const source = queue.shift()!;
  for (const neighbor of valves.get(source)!.neighbors) {
    if (!queue.includes(neighbor)) continue;

    const rate = valves.get(neighbor)!.rate;
    const weight = weights[source] ?? -Infinity;
    const alt = weight + rate * (minutes[source] - (rate > 0 ? 2 : 1));

    if (alt > (weights[neighbor] ?? -Infinity)) {
      weights[neighbor] = alt;
      minutes[neighbor] = minutes[source] - (rate > 0 ? 2 : 1);
      pressure[neighbor] = pressure[source] + minutes[neighbor] * rate;
      hops[neighbor] = source;
    }
  }
}

console.log(pressure);
