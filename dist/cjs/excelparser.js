"use strict";
exports.__esModule = true;
exports.ExcelRenderer = exports.OutTable = void 0;
var tslib_1 = require("tslib");
var jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable react/no-array-index-key */
var XLSX = tslib_1.__importStar(require("xlsx"));
function OutTable(props) {
    var className = props.className, tableClassName = props.tableClassName, tableHeaderRowClass = props.tableHeaderRowClass, withZeroColumn = props.withZeroColumn, withoutRowNum = props.withoutRowNum, columns = props.columns, data = props.data, renderRowNum = props.renderRowNum;
    return ((0, jsx_runtime_1.jsx)("div", tslib_1.__assign({ className: className }, { children: (0, jsx_runtime_1.jsx)("table", tslib_1.__assign({ className: tableClassName }, { children: (0, jsx_runtime_1.jsxs)("tbody", { children: [(0, jsx_runtime_1.jsxs)("tr", { children: [withZeroColumn && !withoutRowNum && (0, jsx_runtime_1.jsx)("th", { className: tableHeaderRowClass || '' }), columns === null || columns === void 0 ? void 0 : columns.map(function (c) { return (0, jsx_runtime_1.jsx)("th", tslib_1.__assign({ className: c.key ? tableHeaderRowClass : '' }, { children: c.key ? '' : c.name }), c.key); })] }), data.map(function (r, i) { return ((0, jsx_runtime_1.jsxs)("tr", { children: [!withoutRowNum && (0, jsx_runtime_1.jsx)("td", tslib_1.__assign({ className: tableHeaderRowClass }, { children: renderRowNum ? renderRowNum(r, i) : i }), i), columns === null || columns === void 0 ? void 0 : columns.map(function (c) { return (0, jsx_runtime_1.jsx)("td", { children: r[c.key] }, c.key); })] }, i)); })] }) })) })));
}
exports.OutTable = OutTable;
function makeCols(refstr) {
    var o = [];
    var C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
    }
    return o;
}
function ExcelRenderer(file, callback) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        var rABS = !!reader.readAsBinaryString;
        reader.onload = function (e) {
            var _a;
            /* Parse data */
            var bstr = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            var wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });
            /* Get first worksheet */
            var wsname = wb.SheetNames[0];
            var ws = wb.Sheets[wsname];
            /* Convert array of arrays */
            var json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            var cols = makeCols(ws['!ref']);
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
exports.ExcelRenderer = ExcelRenderer;
//# sourceMappingURL=excelparser.js.map