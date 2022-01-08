import normalizePort from '@fvilers/normalize-port';
import { createCacheStorage } from '@varasto/cache-storage';
import { createRouter } from '@varasto/express-crud';
import { createFileSystemStorage } from '@varasto/fs-storage';
import express from 'express';
import morgan from 'morgan';
import path from 'path';

import { entrySchema } from './schema';

const app = express();
const port = normalizePort(process.env.PORT || '3000');
const storage = createCacheStorage(
  createFileSystemStorage({
    dir: process.env.OSTOSLISTA_DATA || path.resolve(__dirname, '..', 'data'),
  }),
  // 15 minutes in milliseconds.
  900000
);

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', createRouter(storage, 'entries', { schema: entrySchema }));

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
