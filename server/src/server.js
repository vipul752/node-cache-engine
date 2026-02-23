import express from "express";
import LRUCache from "./LRU.js";
import { getFromDB } from "./db.js";
import PUBSUB from "./pubsub.js";

const app = express();
app.use(express.json());

const cache = new LRUCache(5);

const pubsub = new PUBSUB();

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

app.get("/keys", (req, res) => {
  res.json(cache.getAll());
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

app.get("/subscribe/:channel", (req, res) => {
  const channel = req.params.channel;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("X-Accel-Buffering", "no");

  res.flushHeaders();

  // Send initial connection message
  res.write(": connected\n\n");

  // Send heartbeat every 15 seconds to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(": heartbeat\n\n");
  }, 15000);

  pubsub.subscribe(channel, res);

  // Send all message history to new subscriber
  const history = cache.get(`channel:${channel}:history`) || [];
  for (const msg of history) {
    res.write(`data: ${JSON.stringify(msg)}\n\n`);
  }

  console.log(`Subscribed to ${channel}`);

  req.on("close", () => {
    clearInterval(heartbeat);
    pubsub.unsubscribe(channel, res);
    console.log(`Unsubscribed from ${channel}`);
  });
});

app.post("/publish", (req, res) => {
  const { channel, message } = req.body;

  const history = cache.get(`channel:${channel}:history`) || [];
  history.push(message);
  cache.set(`channel:${channel}:history`, history);

  pubsub.publish(channel, message);
  res.send("Message published");
});

app.listen(3000, () => console.log("Server running on 3000"));
