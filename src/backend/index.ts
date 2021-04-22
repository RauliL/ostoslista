import { createRouter } from '@varasto/express-crud';
import { createStorage } from '@varasto/storage';
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import * as yup from 'yup';

import { normalizePort } from './utils';

const entrySchema = yup.object().shape({
  id: yup.string().uuid().optional(),
  text: yup.string().required().max(150),
  done: yup.boolean().required(),
});

const app = express();
const port = normalizePort(process.env.PORT || '3000');
const storage = createStorage({
  dir: process.env.OSTOSLISTA_DATA || path.resolve(__dirname, '..', 'data'),
});

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', createRouter(storage, 'entries', entrySchema));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.on('error', (err: any) => {
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;

  if (err.syscall !== 'listen') {
    throw err;
  }

  // Handle specific listen errors with user friendly messages.
  switch (err.code) {
    case 'EACCES':
      process.stderr.write(`${bind} requires elevated privileges`);
      process.exit(1);
      break;

    case 'EADDRINUSE':
      process.stderr.write(`${bind} is already in use`);
      process.exit(1);
      break;

    default:
      throw err;
  }
});

app.listen(port);
