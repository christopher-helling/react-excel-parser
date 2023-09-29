export var isBoolean = function (value) { return typeof value === 'boolean'; };
export var isNumber = function (value) { return typeof value === 'number' && !Number.isNaN(value); };
export var isFunction = function (value) { return typeof value === 'function'; };
// note that an array is considered an object in javascript
export var isObject = function (value) { return (typeof value === 'function' || typeof value === 'object') && !!value; };
// null, undefined
export var isNull = function (value) { return value === null || value === undefined; };
// null, undefined, []
export var isEmptyArray = function (value) { return isNull(value)
    || (Array.isArray(value) && value.length === 0); };
export var isValidDate = function (value) { return (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime())); };
// null, undefined, {}, invalid date -- note that an empty array is not an empty object: [] --> false, isEmptyObject([]) = false, !isEmptyObject([]) = true
export var isEmptyObject = function (value) { return !isFunction(value) && !Array.isArray(value)
    && !isValidDate(value) && (isNull(value) || (isObject(value) && Object.keys(value).length === 0)); };
// null, undefined, {}, [], invalid date, ''
export var isNullOrEmpty = function (value) { return !isFunction(value)
    && ((value === null || value === void 0 ? void 0 : value.length) === 0 || isEmptyArray(value) || isEmptyObject(value)); };
// null, undefined, {}, [], invalid date, '', '    '
export var isNullOrWhitespace = function (value) { return isNullOrEmpty(value)
    || (typeof (value) === 'string' && !value.trim()); };
//# sourceMappingURL=utils.js.map