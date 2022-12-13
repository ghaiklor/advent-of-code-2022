import fs from "fs";
import path from "path";

type Packet = number | Array<Packet>;

const file = path.resolve(__dirname, "input.txt");
const pairs = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n\n");
const packets: Array<Packet> = pairs
  .map((p) => [JSON.parse(p.split("\n")[0]), JSON.parse(p.split("\n")[1])])
  .flat()
  .concat([[[2]], [[6]]])
  .sort(compare);

function compare(left: Packet, right: Packet): number {
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? -1 : left === right ? 0 : 1;
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      const order = compare(left[i], right[i]);
      if (order === 0) {
        continue;
      }

      return order;
    }

    return compare(left.length, right.length);
  } else if (Array.isArray(left) && typeof right === "number") {
    return compare(left, [right]);
  } else if (typeof left === "number" && Array.isArray(right)) {
    return compare([left], right);
  } else {
    return 1;
  }
}

let key = 1;
for (let i = 0; i < packets.length; i++) {
  if (packets[i].toString() === "2") key *= i + 1;
  if (packets[i].toString() === "6") key *= i + 1;
}

console.log(key);
