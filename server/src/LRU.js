import Metrics from "./metrics.js";
import { save, load } from "./persistence.js";

class Node {
  constructor(key, value, expiry = null) {
    this.key = key;
    this.value = value;
    this.expiry = expiry;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity = 100) {
    this.capacity = capacity;
    this.map = new Map();
    this.metrics = new Metrics();

    this.head = new Node(null, null);
    this.tail = new Node(null, null);

    this.head.next = this.tail;
    this.tail.prev = this.head;

    this._loadFromDisk();
  }

  _remove(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _add(node) {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }

  _isExpired(node) {
    return node.expiry && Date.now() > node.expiry;
  }

  set(key, value, ttl = null) {
    let expiry = ttl ? Date.now() + ttl : null;

    if (this.map.has(key)) {
      this._remove(this.map.get(key));
    }

    const node = new Node(key, value, expiry);
    this._add(node);
    this.map.set(key, node);

    if (this.map.size > this.capacity) {
      const lru = this.tail.prev;
      this._remove(lru);
      this.map.delete(lru.key);
      this.metrics.recordEviction();
    }

    this._persist();
  }

  get(key) {
    const node = this.map.get(key);

    if (!node) {
      this.metrics.recordMiss();
      return null;
    }

    if (this._isExpired(node)) {
      this._remove(node);
      this.map.delete(key);
      this.metrics.recordMiss();
      return null;
    }

    this._remove(node);
    this._add(node);

    this.metrics.recordHit();
    return node.value;
  }

  delete(key) {
    const node = this.map.get(key);
    if (!node) return;

    this._remove(node);
    this.map.delete(key);
    this._persist();
  }

  deleteNamespace(namespace) {
    for (let key of this.map.keys()) {
      if (key.startsWith(namespace + ":")) {
        this.delete(key);
      }
    }
  }

  getMetrics() {
    return this.metrics.getStats();
  }

  getAll() {
    const result = [];
    for (let [key, node] of this.map.entries()) {
      if (!this._isExpired(node)) {
        result.push({ key, value: node.value });
      }
    }
    return result;
  }

  _persist() {
    save(this.map);
  }

  _loadFromDisk() {
    const data = load();

    for (let [key, val] of data.entries()) {
      const node = new Node(key, val.value, val.expiry);
      this._add(node);
      this.map.set(key, node);
    }
  }
}

export default LRUCache;
