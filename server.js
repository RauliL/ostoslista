/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./backend/api.ts":
/*!************************!*\
  !*** ./backend/api.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nvar storage_1 = __webpack_require__(/*! ./storage */ \"./backend/storage.ts\");\nvar router = express_1.default.Router();\nmodule.exports = router;\nvar handleError = function (res, err) {\n    var status = err.status;\n    if (typeof status === 'number') {\n        res.status(status);\n    }\n    else {\n        res.status(500);\n    }\n    res.json({ error: \"\" + err });\n};\nrouter.get('/', function (req, res) { return (storage_1.listItems()\n    .then(function (items) { return res.status(200).json(items); })\n    .catch(function (err) { return handleError(res, err); })); });\nrouter.put('/', function (req, res) { return (storage_1.createItem(req.body.text)\n    .then(function (item) { return res.status(201).json(item); })\n    .catch(function (err) { return handleError(res, err); })); });\nrouter.patch('/:id', function (req, res) { return (storage_1.updateItem({\n    id: req.params.id,\n    text: req.body.text,\n    done: !!req.body.done\n})\n    .then(function (item) { return res.status(200).json(item); })\n    .catch(function (err) { return handleError(res, err); })); });\nrouter.delete('/:id', function (req, res) { return (storage_1.deleteItem(req.params.id)\n    .then(function () { return res.status(200).json({ id: req.params.id }); })\n    .catch(function (err) { return handleError(res, err); })); });\n\n\n//# sourceURL=webpack:///./backend/api.ts?");

/***/ }),

/***/ "./backend/index.ts":
/*!**************************!*\
  !*** ./backend/index.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/* WEBPACK VAR INJECTION */(function(__dirname) {\nvar __importDefault = (this && this.__importDefault) || function (mod) {\n    return (mod && mod.__esModule) ? mod : { \"default\": mod };\n};\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar body_parser_1 = __importDefault(__webpack_require__(/*! body-parser */ \"body-parser\"));\nvar express_1 = __importDefault(__webpack_require__(/*! express */ \"express\"));\nvar path = __importStar(__webpack_require__(/*! path */ \"path\"));\nvar utils_1 = __webpack_require__(/*! ./utils */ \"./backend/utils.ts\");\nvar debug = __webpack_require__(/*! debug */ \"debug\")('ostoslista-server');\nvar DEFAULT_PORT = 3000;\nvar port = utils_1.normalizePort(process.env.PORT || DEFAULT_PORT);\nvar publicDir = path.join(__dirname, '..', 'public');\nvar app = express_1.default();\napp.set('view engine', 'pug');\napp.set('views', path.join(__dirname, '..', 'views'));\napp.use(express_1.default.static(publicDir));\napp.use(body_parser_1.default.json());\napp.use('/api', __webpack_require__(/*! ./api */ \"./backend/api.ts\"));\napp.get('/', function (req, res) { return res.render('index'); });\napp.on('error', function (err) {\n    var bind = typeof port === 'string' ? \"Pipe \" + port : \"Port \" + port;\n    if (err.syscall !== 'listen') {\n        throw err;\n    }\n    // Handle specific listen errors with user friendly messages.\n    switch (err.code) {\n        case 'EACCES':\n            process.stderr.write(bind + \" requires elevated privileges\");\n            process.exit(1);\n            break;\n        case 'EADDRINUSE':\n            process.stderr.write(bind + \" is already in use\");\n            process.exit(1);\n            break;\n        default:\n            throw err;\n    }\n});\napp.listen(port, function () { return debug(\"Listening on \" + port); });\n\n/* WEBPACK VAR INJECTION */}.call(this, \"backend\"))\n\n//# sourceURL=webpack:///./backend/index.ts?");

/***/ }),

/***/ "./backend/storage.ts":
/*!****************************!*\
  !*** ./backend/storage.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nvar __importStar = (this && this.__importStar) || function (mod) {\n    if (mod && mod.__esModule) return mod;\n    var result = {};\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\n    result[\"default\"] = mod;\n    return result;\n};\nObject.defineProperty(exports, \"__esModule\", { value: true });\nvar redis = __importStar(__webpack_require__(/*! redis */ \"redis\"));\nvar uuid_1 = __webpack_require__(/*! uuid */ \"uuid\");\nvar debug = __webpack_require__(/*! debug */ \"debug\")('ostoslista:storage');\nvar DEFAULT_REDIS_URL = 'redis://localhost';\nvar KEY_PREFIX = 'ostoslista:items';\n/**\n * Our connection to Redis storage.\n */\nvar client = redis.createClient(process.env.REDIS_URL || DEFAULT_REDIS_URL);\nclient.on('ready', function () {\n    debug('Redis connection established.');\n});\nclient.on('error', function (err) {\n    debug('Unable to establish Redis connection: $0', err);\n});\n/**\n * Tests whether given input contains valid item identifier.\n */\nvar isValidId = function (id) { return /^[a-f0-9-]+$/.test(id); };\n/**\n * Helper function for constructing errors with HTTP status code.\n */\nvar error = function (status, message) {\n    var instance = new Error(message);\n    instance.status = status;\n    return instance;\n};\n/**\n * Helper function for converting shopping list item from it's JSON serialized\n * format into format suitable for stored into Redis.\n */\nvar convertToStorage = function (item) { return ({\n    id: item.id,\n    text: item.text.trim(),\n    done: item.done ? '1' : '0',\n}); };\n/**\n * Attempts to retrieve individual shopping list item.\n */\nvar getItem = function (id) { return new Promise(function (resolve, reject) {\n    var key = KEY_PREFIX + \":\" + id;\n    if (!isValidId(id)) {\n        reject(error(404, 'Item does not exist.'));\n        return;\n    }\n    client.hgetall(key, function (err, item) {\n        if (err) {\n            reject(error(500, 'Unable to retrieve item from the server.'));\n        }\n        else if (!item) {\n            reject(error(404, 'Item does not exist.'));\n        }\n        else {\n            resolve({\n                id: item.id,\n                text: item.text,\n                done: item.done !== '0',\n            });\n        }\n    });\n}); };\n/**\n * Returns an array containing every shopping list item in the storage.\n */\nexports.listItems = function () { return new Promise(function (resolve, reject) {\n    client.lrange(KEY_PREFIX, 0, -1, function (err, ids) {\n        if (err) {\n            reject(error(500, 'Unable to retrieve items from the server.'));\n            return;\n        }\n        Promise.all(ids.map(getItem))\n            .then(resolve)\n            .catch(reject);\n    });\n}); };\n/**\n * Attempts to create new shopping list item from the given text.\n */\nexports.createItem = function (text) { return new Promise(function (resolve, reject) {\n    var id = uuid_1.v4();\n    var key = KEY_PREFIX + \":\" + id;\n    var item = { id: id, text: text, done: false };\n    if (/^\\s*$/.test(text)) {\n        reject(error(400, 'Attempted to create item without text.'));\n        return;\n    }\n    client.hmset(key, convertToStorage(item), function (err) {\n        if (err) {\n            reject(error(500, 'Unable to create new item.'));\n            return;\n        }\n        client.rpush(KEY_PREFIX, id, function (err) {\n            if (err) {\n                client.del(key);\n                reject(error(500, 'Unable to create new item.'));\n            }\n            else {\n                resolve(item);\n            }\n        });\n    });\n}); };\n/**\n * Updates existing item in the storage.\n */\nexports.updateItem = function (item) { return new Promise(function (resolve, reject) {\n    var key = KEY_PREFIX + \":\" + item.id;\n    if (/^\\s*$/.test(item.id)) {\n        reject(error(400, 'Attempted to update item without id.'));\n        return;\n    }\n    if (/^\\s*$/.test(item.text)) {\n        reject(error(400, 'Attempted to update item without text.'));\n        return;\n    }\n    client.hmset(key, convertToStorage(item), function (err) {\n        if (err) {\n            reject(error(500, 'Unable to update the item.'));\n            return;\n        }\n        resolve(item);\n    });\n}); };\n/**\n * Deletes item with given identifier from the storage.\n */\nexports.deleteItem = function (id) { return new Promise(function (resolve, reject) {\n    client.del(KEY_PREFIX + \":\" + id, function (err) {\n        if (err) {\n            reject(error(404, 'Item does not exist.'));\n        }\n        else {\n            client.lrem(KEY_PREFIX, 0, id);\n            resolve();\n        }\n    });\n}); };\n\n\n//# sourceURL=webpack:///./backend/storage.ts?");

/***/ }),

/***/ "./backend/utils.ts":
/*!**************************!*\
  !*** ./backend/utils.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\nObject.defineProperty(exports, \"__esModule\", { value: true });\n/**\n * Normalize a port into a number, string or false. Taken from Express'\n * application generator.\n */\nexports.normalizePort = function (value) {\n    if (typeof value === 'number') {\n        return value;\n    }\n    var port = parseInt(value, 10);\n    if (isNaN(port)) {\n        // Named pipe.\n        return value;\n    }\n    if (port >= 0) {\n        // Port number.\n        return port;\n    }\n    return false;\n};\n\n\n//# sourceURL=webpack:///./backend/utils.ts?");

/***/ }),

/***/ 0:
/*!********************************!*\
  !*** multi ./backend/index.ts ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(/*! /home/rauli/project/ostoslista/backend/index.ts */\"./backend/index.ts\");\n\n\n//# sourceURL=webpack:///multi_./backend/index.ts?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "debug":
/*!************************!*\
  !*** external "debug" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"debug\");\n\n//# sourceURL=webpack:///external_%22debug%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");\n\n//# sourceURL=webpack:///external_%22path%22?");

/***/ }),

/***/ "redis":
/*!************************!*\
  !*** external "redis" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"redis\");\n\n//# sourceURL=webpack:///external_%22redis%22?");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");\n\n//# sourceURL=webpack:///external_%22uuid%22?");

/***/ })

/******/ });