import fs from "fs";
import path from "path";

type Valve = {
  id: string;
  rate: number;
  neighbors: Array<Valve["id"]>;
};

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const valves: Map<Valve["id"], Valve> = new Map();
const pathFromTo: Map<
  `${Valve["id"]}->${Valve["id"]}`,
  Array<Valve["id"]>
> = new Map();

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
// However, optimal here means just the shortest in terms of time
// The weight of the edges here is always 1, because the time between caves is 1
// This is the classic Dijkstra algorithm, so nothing to comment here
for (const start of valves.values()) {
  const queue: Array<Valve["id"]> = Array.from(valves.keys());
  const hops: Record<Valve["id"], Valve["id"]> = {};
  const distance: Record<Valve["id"], number> = { [start.id]: 0 };

  while (queue.length > 0) {
    queue.sort((a, b) => (distance[a] ?? Infinity) - (distance[b] ?? Infinity));

    const source = queue.shift()!;
    for (const neighbor of valves.get(source)!.neighbors) {
      if (!queue.includes(neighbor)) continue;

      const weight = distance[source] ?? Infinity;
      const alt = weight + 1;

      if (alt < (distance[neighbor] ?? Infinity)) {
        distance[neighbor] = alt;
        hops[neighbor] = source;
      }
    }
  }

  // When we found the path from source to any of other valves
  // We can build a map where we assign those path as source->target
  for (const target of valves.keys()) {
    let path: Array<Valve["id"]> = [];
    let hop: Valve["id"] = target;

    if (hops[hop] || hop === start.id) {
      while (hop) {
        path.unshift(hop);
        hop = hops[hop];
      }
    }

    pathFromTo.set(`${start.id}->${target}`, path);
  }
}

// Now, having all the combinations of path we can take from and to
// Let's start walking...
function walk(
  position: Valve["id"],
  isElephant: boolean,
  time: number,
  pressure: number,
  opened: Set<Valve["id"]>,
  toOpen: Set<Valve>
) {
  // What is the pressure rate right now for opened valves?
  let rate = Array.from(opened.values()).reduce(
    (rate, v) => rate + valves.get(v)!.rate,
    0
  );

  // Maximux possible pressure in this case, including the past ones
  let max = pressure + rate * (26 - time);

  // If we are walking as we, not the elephant, we direct the elephant too
  if (!isElephant) {
    const candidates = new Set(
      Array.from(toOpen).filter((v) => !opened.has(v.id))
    );

    const maxForElephant = walk("AA", true, 0, 0, new Set(), candidates);

    max = pressure + rate * (26 - time) + maxForElephant;
  }

  // Those useful valves are all candidates to open
  for (const valve of toOpen) {
    // Unless they are already opened
    if (opened.has(valve.id)) continue;

    // Time spent to go to the valve from current position, including its opening
    // Because path holds the starting point as well
    // The length here actually means (realDistance + 1)
    const timeDelta = pathFromTo.get(`${position}->${valve.id}`)!.length;

    // Now, if it turns out that the time needed to go there is longer than we have
    // Then it makes no sense to going there, we don't have time for that
    if (time + timeDelta >= 26) continue;

    // However, if we have the time, we open the valve and calculate new pressure
    const newTotal = pressure + timeDelta * rate;
    opened.add(valve.id);

    // Assuming that this strategy works best, we continue walking
    const value = walk(
      valve.id,
      isElephant,
      time + timeDelta,
      newTotal,
      opened,
      toOpen
    );

    // But if turns out that there are possible routes that leads us to greater pressure
    // We update our max pressure value with it
    if (max < value) max = value;

    // And closing the valve, because, turns out, opening it didn't really gave us the max pressure
    opened.delete(valve.id);
  }

  return max;
}

const result = walk(
  "AA",
  false,
  0,
  0,
  new Set(),
  new Set(Array.from(valves.values()).filter((v) => v.rate > 0))
);

console.log(result);
