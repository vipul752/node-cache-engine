# Node Cache Engine

A high-performance, in-memory caching solution built with Node.js. Features LRU eviction, TTL expiration, metrics tracking, disk persistence, and a REST API.

## Features

- **LRU Eviction** - Automatically evicts least recently used items when capacity is reached
- **TTL Support** - Set expiration time for cached items
- **Metrics Tracking** - Monitor hits, misses, evictions, and hit rate
- **Disk Persistence** - Cache survives server restarts
- **Namespace Support** - Group and bulk-delete related keys
- **Cache-Aside Pattern** - Automatic DB fallback with caching
- **REST API** - Full HTTP interface via Express.js

## Installation

```bash
npm install
```

## Usage

### Starting the Server

```bash
node src/server.js
```

The server runs on port **3000** by default.

## API Endpoints

### Set a Cache Value

```http
POST /set
Content-Type: application/json

{
  "key": "myKey",
  "value": "myValue",
  "ttl": 5000
}
```

| Parameter | Required | Description                  |
| --------- | -------- | ---------------------------- |
| `key`     | Yes      | The cache key                |
| `value`   | Yes      | The value to store           |
| `ttl`     | No       | Time to live in milliseconds |

### Get a Cache Value

```http
GET /get/:key
```

**Response:**

```json
{ "value": "myValue" }
```

Returns `null` if the key doesn't exist or has expired.

### Delete a Key

```http
DELETE /delete/:key
```

### Delete by Namespace

Delete all keys with a specific prefix (e.g., `user:*`):

```http
DELETE /namespace/:ns
```

Example: `DELETE /namespace/user` deletes `user:1`, `user:2`, etc.

### Get Metrics

```http
GET /metrics
```

**Response:**

```json
{
  "hits": 432248,
  "misses": 17173,
  "evictions": 100,
  "hitRate": 0.96
}
```

### Cache-Aside Data Fetch

Automatically checks cache first, falls back to DB if miss:

```http
GET /data/:id
```

**Response (cache hit):**

```json
{ "source": "cache", "data": { "name": "Vipul" } }
```

**Response (cache miss):**

```json
{ "source": "db", "data": { "name": "Vipul" } }
```

## Architecture

### LRU Cache (`LRU.js`)

Implements Least Recently Used eviction using a doubly linked list and hash map for **O(1)** get/set operations.

```javascript
import LRUCache from "./LRU.js";

const cache = new LRUCache(100); // capacity of 100 items
cache.set("key", "value", 5000); // optional TTL in ms
cache.get("key"); // moves to front (most recently used)
cache.delete("key");
cache.deleteNamespace("user"); // delete all user:* keys
cache.getMetrics(); // { hits, misses, evictions, hitRate }
```

### Metrics (`metrics.js`)

Tracks cache performance:

- **Hits** - Key found in cache
- **Misses** - Key not found or expired
- **Evictions** - Items removed due to capacity limit
- **Hit Rate** - hits / (hits + misses)

### Persistence (`persistence.js`)

Automatically saves cache to `data.json` on every write and restores on startup.

### Database Simulation (`db.js`)

Mock database for demonstrating cache-aside pattern with 100ms latency.

## Project Structure

```
node-cache-engine/
├── package.json
├── README.md
├── data.json         # Persisted cache data
└── src/
    ├── LRU.js        # LRU cache with TTL & metrics
    ├── db.js         # Mock database
    ├── metrics.js    # Performance tracking
    ├── persistence.js # Disk save/load
    └── server.js     # Express REST API
```

## Dependencies

- [Express](https://expressjs.com/) - Web framework for the REST API

## Testing

### Load test with autocannon

```bash
# Start server
node src/server.js

# Run load test (100 connections, 10 seconds)
autocannon -c 100 -d 10 http://localhost:3000/get/1
```

### Test evictions

```bash
# Add more keys than capacity (default: 5)
for i in {1..10}; do
  curl -X POST http://localhost:3000/set \
    -H "Content-Type: application/json" \
    -d "{\"key\":\"k$i\",\"value\":\"v$i\"}"
done

# Check metrics
curl http://localhost:3000/metrics
```

## License

ISC
