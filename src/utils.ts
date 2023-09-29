export const isBoolean = (value: any): value is boolean => typeof value === 'boolean';

export const isNumber = (value: any): value is number => typeof value === 'number' && !Number.isNaN(value);

export const isFunction = (value: any): value is Function => typeof value === 'function';

// note that an array is considered an object in javascript
export const isObject = (value: any): value is Object => (typeof value === 'function' || typeof value === 'object') && !!value;

// null, undefined
export const isNull = (value: any): value is null | undefined => value === null || value === undefined;

// null, undefined, []
export const isEmptyArray = (value: unknown[] | null | undefined): value is null | undefined | [] => isNull(value)
|| (Array.isArray(value) && value.length === 0);

export const isValidDate = (value: any): value is Date => (Object.prototype.toString.call(value) === '[object Date]' && !Number.isNaN(value.getTime()));

// null, undefined, {}, invalid date -- note that an empty array is not an empty object: [] --> false, isEmptyObject([]) = false, !isEmptyObject([]) = true
export const isEmptyObject = (value: any): value is null | undefined | Record<PropertyKey, never> => !isFunction(value) && !Array.isArray(value)
&& !isValidDate(value) && (isNull(value) || (isObject(value) && Object.keys(value).length === 0));

// null, undefined, {}, [], invalid date, ''
export const isNullOrEmpty = (value: any): value is (Record<PropertyKey, never> | [] | null | undefined | '') => !isFunction(value)
&& (value?.length === 0 || isEmptyArray(value) || isEmptyObject(value));

// null, undefined, {}, [], invalid date, '', '    '
export const isNullOrWhitespace = (value: any): value is (Record<PropertyKey, never> | [] | null | undefined | '') => isNullOrEmpty(value)
|| (typeof (value) === 'string' && !value.trim());
