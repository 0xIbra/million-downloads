const redis = require('redis');

class Redis {

    constructor(config) {
        this.config = config;
    }

    async connect() {
        this.client = redis.createClient(this.config);

        let connectionResult = await new Promise((resolve, reject) => {
            this.client.on('error', err => {
                reject(err);
            });

            this.client.on('ready', () => {
                resolve(true);
            });
        });

        return connectionResult;
    }

    getClient() {
        return this.client;
    }

    async list(pattern = '*') {
        return new Promise((resolve, reject) => {
            this.client.keys(pattern, (err, keys) => {
                if (err) {
                    reject(err);
                }

                resolve(keys);
            });
        });
    }

    get(key) {
        return new Promise((resolve, reject) => {
            this.client.get(key, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(res)
            })
        })
    }

    async set(key, value) {
        return new Promise((resolve, reject) => {
            this.client.set(key, value, (err, res) => {
                if (err) {
                    reject(err);
                }

                resolve(true);
            });
        });
    }

    async incrBy(key, value) {
        return new Promise((resolve, reject) => {
            this.client.incrby(key, value, (err, val) => {
                if (err) {
                    reject(err);
                }

                resolve(val);
            })
        })
    }

    async disconnect() {
        await this.client.quit();
    }
}

module.exports = Redis;
