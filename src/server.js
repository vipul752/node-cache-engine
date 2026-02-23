import express from "express";
import LRUCache from "./LRU.js";
import { getFromDB } from "./db.js";

const app = express();
app.use(express.json());

const cache = new LRUCache(5);

app.post("/set", (req, res) => {
  const { key, value, ttl } = req.body;
  cache.set(key, value, ttl);
  res.send("OK");
});

app.get("/get/:key", (req, res) => {
  const value = cache.get(req.params.key);
  res.json({ value });
});

app.delete("/delete/:key", (req, res) => {
  cache.delete(req.params.key);
  res.send("Deleted");
});

app.get("/metrics", (req, res) => {
  res.json(cache.getMetrics());
});

app.delete("/namespace/:ns", (req, res) => {
  cache.deleteNamespace(req.params.ns);
  res.send("Namespace cleared");
});

app.get("/data/:id", async (req, res) => {
  const key = `user:${req.params.id}`;

  let data = cache.get(key);

  if (data) {
    return res.json({ source: "cache", data });
  }

  data = await getFromDB(req.params.id);

  if (!data) return res.status(404).send("Not found");

  cache.set(key, data, 5000);

  res.json({ source: "db", data });
});

app.listen(3000, () => console.log("Server running on 3000"));