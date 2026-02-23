class Metrics {
  constructor() {
    this.hits = 0;
    this.misses = 0;
    this.evictions = 0;
  }

  recordHit() {
    this.hits++;
  }

  recordMiss() {
    this.misses++;
  }

  recordEviction() {
    this.evictions++;
  }

  getStats() {
    const total = this.hits + this.misses;
    return {
      hits: this.hits,
      misses: this.misses,
      evictions: this.evictions,
      hitRate: total ? this.hits / total : 0,
    };
  }
}

export default Metrics;
