# Ostoslista [![github-url][github-image]][github-url] [![coveralls][coveralls-image]][coveralls-url] [![npm][npm-image]][npm-url]

[github-image]: https://github.com/RauliL/ostoslista/actions/workflows/lint-and-build.yml/badge.svg
[github-url]: https://github.com/RauliL/ostoslista/actions/workflows/lint-and-build.yml
[coveralls-image]: https://coveralls.io/repos/github/RauliL/ostoslista/badge.svg
[coveralls-url]: https://coveralls.io/github/RauliL/ostoslista
[npm-image]: https://img.shields.io/npm/v/ostoslista.svg
[npm-url]: https://npmjs.org/package/ostoslista

Simple shopping list Web application, in which a single shopping list can be
shared among family members. Uses [Varasto] as storage, while UI has been
implemented with [React] and [Material UI].

[Varasto]: https://github.com/RauliL/varasto
[React]: https://reactjs.org
[Material UI]: https://material-ui.com

## Requirements

- Node.js>=22

## How to get it up and running

Clone this Git repository into somewhere, then proceed by installing
dependencies and building static assets and other TypeScript'y stuff:

```bash
$ npm install
$ npm run build
```

After that you can start the application with:

```bash
$ npm start
```

Which starts the backend HTTP server in port `3000`. You can change the default
port with `PORT` environment variable.

## Attributions

Icon made by [Freepik] from [www.flaticon.com](https://www.flaticon.com).

[Freepik]: https://www.flaticon.com/authors/freepik
