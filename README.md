# Node Cache Engine

A lightweight, in-memory caching solution built with Node.js. This project provides multiple caching strategies including basic caching, LRU (Least Recently Used), and TTL (Time To Live) support.

## Features

- **Basic Cache** - Simple key-value storage using JavaScript Map
- **LRU Cache** - Evicts least recently used items when capacity is reached
- **TTL Cache** - Automatic expiration of cached items after a specified time
- **REST API** - HTTP endpoints for cache operations via Express.js

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

### API Endpoints

#### Set a Cache Value

```http
POST /set
Content-Type: application/json

{
  "key": "myKey",
  "value": "myValue",
  "ttl": 5000
}
```

- `key` (required): The cache key
- `value` (required): The value to store
- `ttl` (optional): Time to live in milliseconds

#### Get a Cache Value

```http
GET /get/:key
```

**Response:**

```json
{
  "value": "myValue"
}
```

Returns `null` if the key doesn't exist or has expired.

## Cache Implementations

### Basic Cache (`cache.js`)

Simple in-memory cache with `set`, `get`, and `delete` operations.

```javascript
import Cache from "./cache.js";

const cache = new Cache();
cache.set("key", "value");
cache.get("key"); // 'value'
cache.delete("key");
```

### LRU Cache (`LRU.js`)

Implements Least Recently Used eviction policy using a doubly linked list and hash map for O(1) operations.

```javascript
import LRUCache from "./LRU.js";

const cache = new LRUCache(100); // capacity of 100 items
cache.set("key", "value");
cache.get("key"); // moves item to front (most recently used)
```

### TTL Cache (`TTL.js`)

Cache with automatic expiration. Items are removed after their TTL expires.

```javascript
import Cache from "./TTL.js";

const cache = new Cache();
cache.set("key", "value", 5000); // expires in 5 seconds
cache.get("key"); // returns value or null if expired
```

## Project Structure

```
node-cache-engine/
├── package.json
├── README.md
└── src/
    ├── cache.js    # Basic cache implementation
    ├── LRU.js      # LRU cache with capacity limit
    ├── TTL.js      # TTL-based cache with expiration
    └── server.js   # Express REST API server
```

## Dependencies

- [Express](https://expressjs.com/) - Web framework for the REST API

## License

ISC
