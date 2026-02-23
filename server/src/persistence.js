import fs from "fs";

const FILE = "./data.json";

export function save(store) {
  const data = {};

  for (let [key, node] of store.entries()) {
    data[key] = {
      value: node.value,
      expiry: node.expiry,
    };
  }

  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function load() {
  if (!fs.existsSync(FILE)) return new Map();

  const raw = fs.readFileSync(FILE);
  const parsed = JSON.parse(raw);

  const map = new Map();

  for (let key in parsed) {
    map.set(key, parsed[key]);
  }

  return map;
}
