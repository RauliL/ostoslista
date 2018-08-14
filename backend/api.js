const express = require('express');

const Item = require('./item');
const redisClient = require('./redis-client');

const router = express.Router();

module.exports = router;

const handleError = (res, err) => {
  const { status } = err;

  if (typeof status === 'number') {
    res.status(status);
  } else {
    res.status(500);
  }
  res.json({ error: `${err}` });
};

router.get('/', (req, res) => (
  Item.list(redisClient)
    .then((items) => res.status(200).json(items))
    .catch((err) => handleError(err, res))
));

router.put('/', (req, res) => (
  Item.create(redisClient, req.body.text)
    .then((item) => res.status(201).json(item))
    .catch((err) => handleError(res, err))
));

router.get('/:id', (req, res) => (
  Item.get(redisClient, req.params.id)
    .then((item) => res.status(200).json(item))
    .catch((err) => handleError(res, err))
));

router.patch('/:id', (req, res) => (
  Item.update(redisClient, {
    id: req.params.id,
    text: req.body.text,
    done: !!req.body.done
  })
    .then((item) => res.status(200).json(item))
    .catch((err) => handleError(res, err))
));

router.delete('/:id', (req, res) => (
  Item.delete(redisClient, req.params.id)
    .then((item) => res.status(200).json({ id: req.params.id }))
    .catch((err) => handleError(res, err))
));
