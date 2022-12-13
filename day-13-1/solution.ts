import fs from "fs";
import path from "path";

type Packet = number | Array<Packet>;
type Status = "CORRECT" | "WRONG" | "CONTINUE";

const file = path.resolve(__dirname, "input.txt");
const pairs = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n\n");
const indices = [];

function order(left: Packet, right: Packet): Status {
  if (typeof left === "number" && typeof right === "number") {
    return left < right ? "CORRECT" : left === right ? "CONTINUE" : "WRONG";
  } else if (Array.isArray(left) && Array.isArray(right)) {
    for (let i = 0; i < left.length; i++) {
      const status = order(left[i], right[i]);
      if (status === "CONTINUE") {
        continue;
      }

      return status;
    }

    return order(left.length, right.length);
  } else if (Array.isArray(left) && typeof right === "number") {
    return order(left, [right]);
  } else if (typeof left === "number" && Array.isArray(right)) {
    return order([left], right);
  } else {
    return "WRONG";
  }
}

for (let i = 0; i < pairs.length; i++) {
  const leftPacket: Packet = JSON.parse(pairs[i].split("\n")[0]);
  const rightPacket: Packet = JSON.parse(pairs[i].split("\n")[1]);

  if (order(leftPacket, rightPacket) !== "WRONG") {
    indices.push(i + 1);
  }
}

console.log(indices.reduce((a, b) => a + b));
