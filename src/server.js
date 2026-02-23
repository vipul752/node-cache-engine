import express from "express";
import Cache from "./TTL.js";
const app = express();

app.use(express.json());

const cache = new Cache();

app.post("/set", (req, res) => {
  const { key, value, ttl } = req.body;
  cache.set(key, value, ttl);
  res.send("OK");
});

app.get("/get/:key", (req, res) => {
  const value = cache.get(req.params.key);
  res.json({ value });
});

app.listen(3000, () => console.log("Server running on port 3000"));
