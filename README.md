# Ostoslista [![github-url][github-image]][github-url] [![coveralls][coveralls-image]][coveralls-url] [![npm][npm-image]][npm-url]

[github-image]: https://github.com/RauliL/ostoslista/actions/workflows/lint-and-build.yml/badge.svg
[github-url]: https://github.com/RauliL/ostoslista/actions/workflows/lint-and-build.yml
[coveralls-image]: https://coveralls.io/repos/github/RauliL/ostoslista/badge.svg
[coveralls-url]: https://coveralls.io/github/RauliL/ostoslista
[npm-image]: https://img.shields.io/npm/v/ostoslista.svg
[npm-url]: https://npmjs.org/package/ostoslista

Simple shopping list Web application, in which a single shopping list can be
shared among family members. Uses [Varasto] as storage, while UI has been
implemented with [React] and [Material UI]. Authentication is provided by
[express-varasto-jwt-auth].

[Varasto]: https://github.com/RauliL/varasto
[React]: https://reactjs.org
[Material UI]: https://material-ui.com
[express-varasto-jwt-auth]: https://github.com/RauliL/express-varasto-jwt-auth

## Requirements

- Node.js>=22

## How to get it up and running

Clone this Git repository into somewhere, then proceed by installing
dependencies and building static assets and other TypeScript'y stuff:

```bash
$ npm install
$ npm run build
```

On a fresh install there are no accounts yet, so run the interactive setup
script:

```bash
$ npm run onboard
```

You will be prompted for an admin username and password. The script can only be
run while no users exist yet.

After that you can start the application with:

```bash
$ npm start
```

Which starts the backend HTTP server in port `3000`. You can change the default
port with `PORT` environment variable.

Recommended for any real deployment:

| Variable               | Default                 | Purpose                                             |
| ---------------------- | ----------------------- | --------------------------------------------------- |
| `JWT_SECRET`           | development placeholder | Secret used to sign authentication tokens           |
| `JWT_EXPIRES_IN`       | `30d`                   | Token lifetime                                      |
| `OSTOSLISTA_DATA`      | `./data`                | Directory for Varasto JSON storage (list entries)   |
| `OSTOSLISTA_AUTH_DATA` | _(unset)_               | Optional separate directory for authentication data |
| `PORT`                 | `3000`                  | HTTP listen port                                    |

By default, users and shopping list entries share `OSTOSLISTA_DATA`. Set
`OSTOSLISTA_AUTH_DATA` to store authentication data in a different directory.

## Attributions

Icon by [Read] on [freeicons.io](https://freeicons.io)
