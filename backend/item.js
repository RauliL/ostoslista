const debug = require('debug')('ostoslista:item');
const uuid = require('uuid/v4');

const ID_PATTERN = /^[a-f0-9-]+$/;
const KEY_PREFIX = 'ostoslista:items';

/**
 * Helper function for constructing errors with HTTP status code.
 */
const error = (status, message) => {
  const instance = new Error(message);

  instance.status = status;

  return instance;
};

/**
 * Tests whether given input contains valid item identifier.
 */
const isValidId = (id) => ID_PATTERN.test(id);

/**
 * Returns the number of shopping list items currently stored in the database.
 */
const count = (redisClient) => new Promise((resolve, reject) => {
  redisClient.llen(KEY_PREFIX, (err, count) => {
    if (err) {
      reject(error(500, 'Unable to retrieve item count from the server.'));
    } else {
      resolve(count);
    }
  });
});

/**
 * Retrieves individual shopping list item from the database, identified by
 * given item id.
 */
const get = (redisClient, id) => new Promise((resolve, reject) => {
  const key = `${KEY_PREFIX}:${id}`;

  if (!isValidId(id)) {
    reject(error(404, 'Item does not exist.'));
    return;
  }

  redisClient.hgetall(key, (err, item) => {
    if (err) {
      reject(error(500, 'Unable to retrieve item from the server.'));
    } else if (!item) {
      reject(error(404, 'Item does not exist.'));
    } else {
      resolve(item);
    }
  });
});

/**
 * Returns list containing every shopping list item.
 */
const list = (redisClient) => new Promise((resolve, reject) => {
  redisClient.lrange(KEY_PREFIX, 0, -1, (err, ids) => {
    if (err) {
      reject(error(500, 'Unable to retrieve items from the server.'));
      return;
    }

    Promise.all(ids.map((id) => get(redisClient, id)))
      .then(resolve)
      .catch(reject);
  });
});

/**
 * Attempts to create new shopping list item from given text.
 */
const create = (redisClient, text) => new Promise((resolve, reject) => {
  const id = uuid();
  const key = `${KEY_PREFIX}:${id}`;
  const item = { id, text, done: '0' };

  if (/^\s*$/.test(text)) {
    reject(error(400, 'Attempted to create item without text.'));
    return;
  }

  redisClient.hmset(key, item, (err) => {
    if (err) {
      reject(error(500, 'Unable to create new item.'));
      return;
    }
    redisClient.rpush(KEY_PREFIX, id, (err) => {
      if (err) {
        redisClient.del(key);
        reject(error(500, 'Unable to create new item.'));
      } else {
        resolve(item);
      }
    });
  });
});

/**
 * Updates existing item in the database.
 */
const update = (redisClient, item) => new Promise((resolve, reject) => {
  const key = `${KEY_PREFIX}:${item.id}`;

  // Redis does not support booleans, so we need to convert them to integer
  // strings first.
  item.done = item.done ? '1' : '0';

  if (/^\s*$/.test(item.id)) {
    reject(error(400, 'Attempted to update item without id.'));
    return;
  }
  if (/^\s*$/.test(item.text)) {
    reject(error(400, 'Attempted to update item without text.'));
    return;
  }

  redisClient.hmset(key, item, (err) => {
    if (err) {
      reject(error(500, 'Unable to update the item.'));
      return;
    }
    resolve(item);
  });
});

/**
 * Deletes item with given identifier from the database.
 */
const del = (redisClient, id) => new Promise((resolve, reject) => {
  redisClient.del(`${KEY_PREFIX}:${id}`, (err) => {
    if (err) {
      reject(error(404, 'Item does not exist.'));
    } else {
      redisClient.lrem(KEY_PREFIX, 0, id);
      resolve(true);
    }
  });
});

module.exports = {
  isValidId,
  count,
  get,
  list,
  create,
  update,
  delete: del
};
