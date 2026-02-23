class Cache {
  constructor() {
    this.store = new Map();
    this.expiry = new Map();
  }

  set(key, value, ttl = null) {
    this.store.set(key, value);

    if (ttl) {
      const expiryTime = Date.now() + ttl;
      this.expiry.set(key, expiryTime);
    }
  }

  get(key) {
    if (this.expiry.has(key)) {
      if (Date.now() > this.expiry.get(key)) {
        this.delete(key);
        return null;
      }
    }
    return this.store.get(key) || null;
  }

  delete(key) {
    this.store.delete(key);
    this.expiry.delete(key);
  }
}

export default Cache;
