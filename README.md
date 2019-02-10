# Ostoslista

Simple shopping list Web application, in which a single shopping list can be
shared among family members. Uses [Redis] as storage, while the UI has been
implemented with [RE:DOM] and [Materialize].

## Requirements

- Redis
- Node.js >=8

## How to get up and running

Clone this Git repository into somewhere, set up your Redis, then proceed by
installing dependencies and building static assets:

```bash
$ npm install
$ npm run build
```

After that you can start the application with:

```bash
$ npm start
```

Which starts the backend HTTP server in port `3000`. You can change the default
port with `PORT` environment variable. Redis is assumed to be running on
`localhost` at default Redis port by default, however this can be customized
with environment variable `REDIS_URL`.

## Attributions

Icon made by [Freepik] from [www.flaticon.com](https://www.flaticon.com).

[Redis]: https://redis.io
[RE:DOM]: https://redom.js.org
[Materialize]: https://materializecss.com
[Freepik]: https://www.flaticon.com/authors/freepik
