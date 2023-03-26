import { __assign } from "tslib";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable react/no-array-index-key */
import * as XLSX from 'xlsx';
export function OutTable(props) {
    var className = props.className, tableClassName = props.tableClassName, tableHeaderRowClass = props.tableHeaderRowClass, withZeroColumn = props.withZeroColumn, withoutRowNum = props.withoutRowNum, columns = props.columns, data = props.data, renderRowNum = props.renderRowNum;
    return (_jsx("div", __assign({ className: className }, { children: _jsx("table", __assign({ className: tableClassName }, { children: _jsxs("tbody", { children: [_jsxs("tr", { children: [withZeroColumn && !withoutRowNum && _jsx("th", { className: tableHeaderRowClass || '' }), columns === null || columns === void 0 ? void 0 : columns.map(function (c) { return _jsx("th", __assign({ className: c.key ? tableHeaderRowClass : '' }, { children: c.key ? '' : c.name }), c.key); })] }), data.map(function (r, i) { return (_jsxs("tr", { children: [!withoutRowNum && _jsx("td", __assign({ className: tableHeaderRowClass }, { children: renderRowNum ? renderRowNum(r, i) : i }), i), columns === null || columns === void 0 ? void 0 : columns.map(function (c) { return _jsx("td", { children: r[c.key] }, c.key); })] }, i)); })] }) })) })));
}
function makeCols(refstr) {
    var o = [];
    var C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (var i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
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
//# sourceMappingURL=excelparser.js.map