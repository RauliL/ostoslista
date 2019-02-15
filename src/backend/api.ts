import express, { Response } from 'express';

import { Item } from '../common/types';

import {
  StorageError,
  createItem,
  deleteItem,
  listItems,
  updateItem,
} from './storage';

const router = express.Router();

module.exports = router;

const handleError = (res: Response, err: StorageError) => {
  const { status } = err;

  if (typeof status === 'number') {
    res.status(status);
  } else {
    res.status(500);
  }
  res.json({ error: `${err}` });
};

router.get('/', (req, res) => (
  listItems()
    .then((items) => res.status(200).json(items))
    .catch((err) => handleError(res, err))
));

router.put('/', (req, res) => (
  createItem(req.body.text)
    .then((item) => res.status(201).json(item))
    .catch((err) => handleError(res, err))
));

router.patch('/:id', (req, res) => (
  updateItem({
    id: req.params.id,
    text: req.body.text,
    done: !!req.body.done
  })
    .then((item) => res.status(200).json(item))
    .catch((err) => handleError(res, err))
));

router.delete('/:id', (req, res) => (
  deleteItem(req.params.id)
    .then(() => res.status(200).json({ id: req.params.id }))
    .catch((err) => handleError(res, err))
));
