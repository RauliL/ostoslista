import * as redis from 'redis';
import { v4 as uuid } from 'uuid';

const debug = require('debug')('ostoslista:storage');

import { Item } from '../common/types';

const DEFAULT_REDIS_URL = 'redis://localhost';
const KEY_PREFIX = 'ostoslista:items';

export interface StorageError extends Error {
  status: number;
}

/**
 * Our connection to Redis storage.
 */
const client = redis.createClient(process.env.REDIS_URL || DEFAULT_REDIS_URL);

client.on('ready', () => {
  debug('Redis connection established.');
});
client.on('error', (err: Error) => {
  debug('Unable to establish Redis connection: $0', err);
});

/**
 * Tests whether given input contains valid item identifier.
 */
const isValidId = (id: string) => /^[a-f0-9-]+$/.test(id);

/**
 * Helper function for constructing errors with HTTP status code.
 */
const error = (status: number, message: string) => {
  const instance = new Error(message) as StorageError;

  instance.status = status;

  return instance;
};

/**
 * Helper function for converting shopping list item from it's JSON serialized
 * format into format suitable for stored into Redis.
 */
const convertToStorage = (item: Item): { [key: string]: string } => ({
  id: item.id,
  text: item.text.trim(),
  done: item.done ? '1' : '0',
});

/**
 * Attempts to retrieve individual shopping list item.
 */
const getItem = (id: string) => new Promise<Item>((resolve, reject) => {
  const key = `${KEY_PREFIX}:${id}`;

  if (!isValidId(id)) {
    reject(error(404, 'Item does not exist.'));
    return;
  }

  client.hgetall(key, (err, item) => {
    if (err) {
      reject(error(500, 'Unable to retrieve item from the server.'));
    } else if (!item) {
      reject(error(404, 'Item does not exist.'));
    } else {
      resolve({
        id: item.id,
        text: item.text,
        done: item.done !== '0',
      });
    }
  });
});

/**
 * Returns an array containing every shopping list item in the storage.
 */
export const listItems = () => new Promise<Item[]>((resolve, reject) => {
  client.lrange(KEY_PREFIX, 0, -1, (err, ids) => {
    if (err) {
      reject(error(500, 'Unable to retrieve items from the server.'));
      return;
    }

    Promise.all<Item>(ids.map(getItem))
      .then(resolve)
      .catch(reject);
  });
});

/**
 * Attempts to create new shopping list item from the given text.
 */
export const createItem = (text: string) => new Promise<Item>(
  (resolve, reject) => {
    const id = uuid();
    const key = `${KEY_PREFIX}:${id}`;
    const item: Item = { id, text, done: false };

    if (/^\s*$/.test(text)) {
      reject(error(400, 'Attempted to create item without text.'));
      return;
    }

    client.hmset(key, convertToStorage(item), (err) => {
      if (err) {
        reject(error(500, 'Unable to create new item.'));
        return;
      }
      client.rpush(KEY_PREFIX, id, (err) => {
        if (err) {
          client.del(key);
          reject(error(500, 'Unable to create new item.'));
        } else {
          resolve(item);
        }
      });
    });
  },
);

/**
 * Updates existing item in the storage.
 */
export const updateItem = (item: Item) => new Promise<Item>(
  (resolve, reject) => {
    const key = `${KEY_PREFIX}:${item.id}`;

    if (/^\s*$/.test(item.id)) {
      reject(error(400, 'Attempted to update item without id.'));
      return;
    }
    if (/^\s*$/.test(item.text)) {
      reject(error(400, 'Attempted to update item without text.'));
      return;
    }

    client.hmset(key, convertToStorage(item), (err) => {
      if (err) {
        reject(error(500, 'Unable to update the item.'));
        return;
      }
      resolve(item);
    });
  },
);

/**
 * Deletes item with given identifier from the storage.
 */
export const deleteItem = (id: string) => new Promise<void>(
  (resolve, reject) => {
    client.del(`${KEY_PREFIX}:${id}`, (err) => {
      if (err) {
        reject(error(404, 'Item does not exist.'));
      } else {
        client.lrem(KEY_PREFIX, 0, id);
        resolve();
      }
    });
  },
);
