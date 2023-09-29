"use strict";
exports.__esModule = true;
exports.isNullOrWhitespace = exports.isNullOrEmpty = exports.isEmptyObject = exports.isValidDate = exports.isEmptyArray = exports.isNull = exports.isObject = exports.isFunction = exports.isNumber = exports.isBoolean = void 0;
var isBoolean = function (value) { return typeof value === 'boolean'; };
exports.isBoolean = isBoolean;
var isNumber = function (value) { return typeof value === 'number' && !Number.isNaN(value); };
exports.isNumber = isNumber;
var isFunction = function (value) { return typeof value === 'function'; };
exports.isFunction = isFunction;
// note that an array is considered an object in javascript
var isObject = function (value) { return (typeof value === 'function' || typeof value === 'object') && !!value; };
exports.isObject = isObject;
// null, undefined
var isNull = function (value) { return value === null || value === undefined; };
exports.isNull = isNull;
// null, undefined, []
var isEmptyArray = function (value) { return (0, exports.isNull)(value)
    || (Array.isArray(value) && value.length === 0); };
exports.isEmptyArray = isEmptyArray;
var isValidDate = function (value) { return (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())); };
exports.isValidDate = isValidDate;
// null, undefined, {}, invalid date -- note that an empty array is not an empty object: [] --> false, isEmptyObject([]) = false, !isEmptyObject([]) = true
var isEmptyObject = function (value) { return !(0, exports.isFunction)(value) && !Array.isArray(value)
    && !(0, exports.isValidDate)(value) && ((0, exports.isNull)(value) || ((0, exports.isObject)(value) && Object.keys(value).length === 0)); };
exports.isEmptyObject = isEmptyObject;
// null, undefined, {}, [], invalid date, ''
var isNullOrEmpty = function (value) { return !(0, exports.isFunction)(value)
    && ((value === null || value === void 0 ? void 0 : value.length) === 0 || (0, exports.isEmptyArray)(value) || (0, exports.isEmptyObject)(value)); };
exports.isNullOrEmpty = isNullOrEmpty;
// null, undefined, {}, [], invalid date, '', '    '
var isNullOrWhitespace = function (value) { return (0, exports.isNullOrEmpty)(value)
    || (typeof (value) === 'string' && !value.trim()); };
exports.isNullOrWhitespace = isNullOrWhitespace;
//# sourceMappingURL=utils.js.map