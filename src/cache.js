class Cache {
  constructor() {
    this.store = new Map();
  }

  set(key, value) {
    this.store.set(key, value);
  }

  get(key) {
    return this.store.get(key) || null;
  }

  delete(key) {
    this.store.delete(key);
  }
}

export default Cache;
