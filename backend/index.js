const bodyParser = require('body-parser');
const debug = require('debug')('ostoslista-server');
const express = require('express');
const normalizePort = require('normalize-port');
const path = require('path');

const DEFAULT_PORT = 3000;

const port = normalizePort(process.env.PORT || DEFAULT_PORT);
const publicDir = path.join(__dirname, '..', 'public');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '..', 'views'));
app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use('/api', require('./api'));

app.get('/', (req, res) => res.render('index'));

app.on('error', (err) => {
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

app.listen(port, () => debug(`Listening on ${port}`));
