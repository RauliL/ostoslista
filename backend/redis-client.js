const debug = require('debug')('ostoslista:redis-client');
const redis = require('redis');

const DEFAULT_REDIS_URL = 'redis://localhost';

const client = redis.createClient(process.env.REDIS_URL || DEFAULT_REDIS_URL);

module.exports = client;

client.on('ready', () => debug('Redis connection established'));
client.on('error', (err) => debug('Unable to establish Redis connection: $0', err));
