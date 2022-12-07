import fs from "fs";
import path from "path";

interface File {
  name: string;
  size: number;
  path: string;
}

interface Dir extends File {
  files: Array<File | Dir>;
  parent: Dir | null;
}

interface Tree {
  currentDir: Dir;
  root: Dir;
}

const file = path.resolve(__dirname, "input.txt");
const input = fs.readFileSync(file, "utf-8").slice(0, -1).split("\n");
const root: Dir = { name: "/", size: 0, path: "/", files: [], parent: null };
const tree: Tree = { root, currentDir: root };
const lessUsedDirs: Map<string, number> = new Map();

for (const line of input) {
  const changeTo = line.match(/\$ cd (.+)/);
  if (changeTo !== null) {
    // we are changing the current directory
    const directory = changeTo[1];

    if (directory === "/") {
      tree.currentDir = root;
      continue;
    }

    if (directory === "..") {
      tree.currentDir = tree.currentDir.parent ?? root;
      continue;
    }

    const dirToChange = tree.currentDir.files.find((f) => f.name === directory);
    if (dirToChange === undefined) {
      // there is no such filename
      continue;
    }

    // I assume the input is correct and no one tries to cd into a file
    tree.currentDir = dirToChange as Dir;
    continue;
  }

  const list = line.match(/\$ ls/);
  if (list !== null) {
    // we don't really need this block
    // but for consistency I'm matching it and passing through
    continue;
  }

  const fileInfo = line.match(/(\d+) (\w+)/);
  if (fileInfo !== null) {
    // we have a file in current directory, so create it in our state
    tree.currentDir.files.push({
      name: fileInfo[1],
      size: parseInt(fileInfo[0], 10),
      path: tree.currentDir.path + `${fileInfo[1]}`,
    } as File);

    // right after that recalculate total size of parent directories
    let parent: Dir | null = tree.currentDir;
    while (parent !== null) {
      parent.size = parent.files.reduce((s, f) => s + f.size, 0);

      // while calculating the size we can also populate the map with needed dirs
      parent.size < 100000
        ? lessUsedDirs.set(parent.path, parent.size)
        : lessUsedDirs.delete(parent.path);

      parent = parent.parent;
    }

    continue;
  }

  const dirInfo = line.match(/dir (\w+)/);
  if (dirInfo !== null) {
    // create a new directory in current directory
    tree.currentDir.files.push({
      name: dirInfo[1],
      size: 0,
      files: [],
      parent: tree.currentDir,
      path: tree.currentDir.path + `${dirInfo[1]}/`,
    } as Dir);

    continue;
  }
}

console.log([...lessUsedDirs].reduce((total, [_, size]) => total + size, 0));
