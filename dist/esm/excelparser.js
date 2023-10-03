import { __assign, __spreadArray } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/no-array-index-key */
import * as XLSX from 'xlsx';
import { isEmptyArray, isFunction, isNull, isObject, isValidDate, } from './utils';
var removeSpaces = function (str) { return str.replace(/\s+/g, ''); };
var preprocessData = function (rows, cols, columnNamesInHeaderRow, selectedColumns, columnFormatter) {
    var _a;
    var tempCols = columnNamesInHeaderRow ? (_a = rows[0]) === null || _a === void 0 ? void 0 : _a.map(function (c, i) { return ({ name: c, key: i }); }) : cols;
    var tempRows = columnNamesInHeaderRow ? rows.slice(1) : rows;
    var lowercaseSelectedColumns = selectedColumns === null || selectedColumns === void 0 ? void 0 : selectedColumns.map(function (sc) { return sc.toLocaleLowerCase(); });
    var newColumns = !isEmptyArray(selectedColumns) && selectedColumns.length > 0
        ? tempCols.filter(function (c) { var _a; return lowercaseSelectedColumns.includes((_a = c === null || c === void 0 ? void 0 : c.name) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()); }) // TODO: match also on removed spaces?
        : tempCols;
    var outputCols = newColumns.map(function (nc) { return ({
        name: nc.name,
        key: nc.key,
        formatter: isFunction(columnFormatter[nc.name]) ? columnFormatter[nc.name] : function (arg) { return arg; }
    }); });
    var newRows = tempRows.map(function (r) { return outputCols.map(function (uc) { return (uc.formatter(r[uc.key])); }); }).filter(function (nr) { return !isEmptyArray(nr); });
    return { cols: outputCols.map(function (c, i) { return ({ name: c.name, key: i }); }), rows: newRows };
};
export function convertExcelRowsToJson(file, columnNamesInHeaderRow, selectedColumns, columnFormatter) {
    var _a;
    var data = preprocessData(file.rows, file.cols, columnNamesInHeaderRow, selectedColumns, columnFormatter);
    return (_a = data.rows) === null || _a === void 0 ? void 0 : _a.map(function (r) { return Object.assign.apply(Object, __spreadArray([{}], (data.cols.map(function (c) {
        var _a;
        return (_a = {}, _a[removeSpaces((c === null || c === void 0 ? void 0 : c.name) || '')] = r[c.key], _a);
    })), false)); });
}
function getCircularReplacer() {
    var _this = this;
    var ancestors = [];
    return function (key, value) {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        // `this` is the object that value is contained in,
        // i.e., its direct parent.
        while (ancestors.length > 0 && ancestors.at(-1) !== _this) {
            ancestors.pop();
        }
        if (ancestors.includes(value)) {
            return '[Circular]';
        }
        ancestors.push(value);
        return value;
    };
}
var formatTableEntry = function (value) {
    if (isValidDate(value))
        return value.toString();
    if (isObject(value))
        return JSON.stringify(value, getCircularReplacer()); // stringify objects even with circular references
    return value;
};
export function OutTable(props) {
    var _a, _b;
    var rows = props.rows, columns = props.columns, selectedColumns = props.selectedColumns, columnFormatter = props.columnFormatter, _c = props.showRowNumbers, showRowNumbers = _c === void 0 ? false : _c, renderRowNum = props.renderRowNum, _d = props.showHeaderRow, showHeaderRow = _d === void 0 ? true : _d, _e = props.columnNamesInHeaderRow, columnNamesInHeaderRow = _e === void 0 ? true : _e, className = props.className, tableClassName = props.tableClassName, tableHeaderRowClass = props.tableHeaderRowClass;
    var data = preprocessData(rows, columns, columnNamesInHeaderRow, selectedColumns, columnFormatter);
    // TODO: throw error if no columns or rows?
    return (_jsx("div", __assign({ className: className }, { children: _jsx("table", __assign({ className: tableClassName }, { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [showHeaderRow && showRowNumbers && _jsx("th", { className: tableHeaderRowClass || '' }), (_a = data.cols) === null || _a === void 0 ? void 0 : _a.map(function (c) { return _jsx("th", __assign({ className: !isNull(c.key) ? tableHeaderRowClass : '' }, { children: !isNull(c.key) ? c.name : '' }), c.key); })] }), (_b = data.rows) === null || _b === void 0 ? void 0 : _b.map(function (r, i) {
                        var _a;
                        return (_jsxs("tr", { children: [showRowNumbers && _jsx("td", __assign({ className: tableHeaderRowClass }, { children: isFunction(renderRowNum) ? renderRowNum(r, i) : i }), i), (_a = data.cols) === null || _a === void 0 ? void 0 : _a.map(function (c) { return _jsx("td", { children: formatTableEntry(r[c.key]) }, c.key); })] }, i));
                    })] }) })) })));
}
function makeCols(refstr) {
    var o = [];
    var C = XLSX.utils.decode_range(refstr).e.c + 1; // number of columns
    for (var i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i }; // { name: 'A', key: 0 }, ..., { name: 'Z', key: 25 }, { name: 'AA', key: 26 }, ...
    }
    return o;
}
export function ExcelRenderer(file, callback) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        var rABS = !!reader.readAsBinaryString;
        reader.onload = function (e) {
            var _a;
            /* Parse data */
            var bstr = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            var wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', cellDates: true });
            /* Get first worksheet */
            var wsname = wb.SheetNames[0];
            var ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            var cols = makeCols(ws['!ref']); // ws['!ref'] is sheet-range, e.g. 'A1:AM1001'
            var data = { rows: json, cols: cols };
            resolve(data);
            return callback(null, data);
        };
        if (file && rABS)
            reader.readAsBinaryString(file);
        else
            reader.readAsArrayBuffer(file);
    });
}
//# sourceMappingURL=excelparser.js.map