import { createCacheStorage } from '@varasto/cache-storage';
import { createRouter } from '@varasto/express-crud';
import { createFileSystemStorage } from '@varasto/fs-storage';
import express from 'express';
import morgan from 'morgan';
import path from 'node:path';

import { entrySchema } from './schema';

const app = express();
const storage =
  process.env.NODE_ENV === 'test'
    ? (await import('@varasto/memory-storage')).createMemoryStorage()
    : createCacheStorage(
        createFileSystemStorage({
          dir:
            process.env.OSTOSLISTA_DATA || path.resolve(process.cwd(), 'data'),
        }),
        // 15 minutes in milliseconds.
        900000
      );

app.use(morgan('combined'));
app.use(express.json());
app.use('/api', createRouter(storage, 'entries', { schema: entrySchema }));

export default app;
