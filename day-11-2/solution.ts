import fs from "fs";
import path from "path";

interface Monkey {
  id: number;
  items: Array<number>;
  operation: { kind: "+" | "*"; value: "old" | string };
  test: { divisibleBy: number; true: number; false: number };
}

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n\n");
const monkeys: Array<Monkey> = [];
const counter: Array<number> = [];

// Before running rounds we need to parse the input into intermediate representation
// So we are going through the input and creating objects with the state
for (const monkeyDefinition of input) {
  const definition = monkeyDefinition.split("\n");
  const id = definition[0].match(/Monkey (\d+)/)!;
  const items = definition[1].match(/Starting items: (.+)$/)!;
  const operation = definition[2].match(/Operation: new = old (.) (.+)$/)!;
  const divisibleBy = definition[3].match(/Test: divisible by (\d+)/)!;
  const ifTrue = definition[4].match(/If true: throw to monkey (\d+)/)!;
  const ifFalse = definition[5].match(/If false: throw to monkey (\d+)/)!;

  monkeys.push({
    id: parseInt(id[1], 10),
    items: items[1].split(", ").map(Number),
    operation: {
      kind: operation[1] as Monkey["operation"]["kind"],
      value: operation[2] as Monkey["operation"]["value"],
    },
    test: {
      divisibleBy: parseInt(divisibleBy[1], 10),
      true: parseInt(ifTrue[1], 10),
      false: parseInt(ifFalse[1], 10),
    },
  });
}

// Playing rounds...
for (let round = 1; round <= 10000; round++) {
  for (let id = 0; id < monkeys.length; id++) {
    const monkey = monkeys[id];

    let item = monkey.items.shift();
    while (item !== undefined) {
      // Parse the operation value and kind of operation to calculate new worry level
      const operationValue = parseInt(monkey.operation.value, 10) || item;
      const newItem =
        monkey.operation.kind === "+"
          ? item + operationValue
          : monkey.operation.kind === "*"
          ? item * operationValue
          : item;

      // Test the new worry level against test conditions for the monkey
      const newMonkeyId =
        newItem % monkey.test.divisibleBy === 0
          ? monkey.test.true
          : monkey.test.false;

      // Compress the worry level without information loss
      // The constant here is the least common multiplier for all monkeys test value
      let itemToThrow = newItem % 9_699_690;

      // Throw the item to the next monkey
      monkeys[newMonkeyId].items.push(itemToThrow);
      item = monkey.items.shift();

      // refresh the counter of inspections
      counter[id] = (counter[id] ?? 0) + 1;
    }
  }
}

const result = counter.sort((a, b) => b - a);
console.log(result[0] * result[1]);
