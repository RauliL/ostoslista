/**
 * Normalize a port into a number, string or false. Taken from Express'
 * application generator.
 */
export const normalizePort = (value: string | number) => {
  if (typeof value === 'number') {
    return value;
  }

  const port = parseInt(value, 10);

  if (isNaN(port)) {
    // Named pipe.
    return value;
  }

  if (port >= 0) {
    // Port number.
    return port;
  }

  return false;
};
