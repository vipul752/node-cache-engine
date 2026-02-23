class PUBSUB {
  constructor() {
    this.channels = new Map();
  }

  subscribe(channel, res) {
    if (!this.channels.has(channel)) {
      this.channels.set(channel, new Set());
    }
    this.channels.get(channel).add(res);
  }

  unsubscribe(channel, res) {
    if (!this.channels.has(channel)) return;

    this.channels.get(channel).delete(res);
  }

  publish(channel, message) {
    if (!this.channels.has(channel)) return;

    for (let client of this.channels.get(channel)) {
      client.write(`data: ${JSON.stringify(message)}\n\n`);
    }
  }
}

export default PUBSUB;