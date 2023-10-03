/* eslint-disable react/no-array-index-key */
import * as XLSX from 'xlsx';
import {
    isEmptyArray, isFunction, isNull, isObject, isValidDate,
} from './utils';

const removeSpaces = (str: string) => str.replace(/\s+/g, '');

export type ParsedExcelFile = { rows: any[], cols: { key: number, name?: string }[] };

const preprocessData = (
    rows: any[],
    cols: { key: number, name?: string }[],
    columnNamesInHeaderRow?: boolean,
    selectedColumns?: string[],
    columnFormatter?: { [key: string]: (arg: any) => any }, // object key should match selected column, { selectedColumn: formattingFunction }
): ParsedExcelFile => {
    const tempCols: { key: number, name?: string }[] = columnNamesInHeaderRow ? rows[0]?.map((c: string, i: number) => ({ name: c, key: i })) : cols;
    const tempRows: any[] = columnNamesInHeaderRow ? rows.slice(1) : rows;
    const lowercaseSelectedColumns = selectedColumns?.map((sc) => sc.toLocaleLowerCase());
    const newColumns = !isEmptyArray(selectedColumns) && selectedColumns.length > 0
        ? tempCols.filter((c) => lowercaseSelectedColumns.includes(c?.name?.toLocaleLowerCase())) // TODO: match also on removed spaces?
        : tempCols;
    const outputCols = newColumns.map((nc) => ({
        name: nc.name,
        key: nc.key,
        formatter: isFunction(columnFormatter?.[nc.name]) ? columnFormatter[nc.name] : (arg: any) => arg,
    }));
    const newRows = tempRows.map((r) => outputCols.map((uc) => (uc.formatter(r[uc.key])))).filter((nr) => !isEmptyArray(nr));
    return { cols: outputCols.map((c, i) => ({ name: c.name, key: i })), rows: newRows };
};

export function convertExcelRowsToJson(
    file: ParsedExcelFile,
    columnNamesInHeaderRow?: boolean,
    selectedColumns?: string[],
    columnFormatter?: { [key: string]: (arg: any) => any },
) {
    const data = preprocessData(file.rows, file.cols, columnNamesInHeaderRow, selectedColumns, columnFormatter);
    return data.rows?.map((r: any[]) => Object.assign({}, ...(data.cols.map((c: { name?: string, key: number }) => ({ [removeSpaces(c?.name || '')]: r[c.key] })))));
}

function getCircularReplacer() {
    const ancestors = [];
    return (key, value) => {
        if (typeof value !== 'object' || value === null) {
            return value;
        }
        // `this` is the object that value is contained in,
        // i.e., its direct parent.
        while (ancestors.length > 0 && ancestors.at(-1) !== this) {
            ancestors.pop();
        }
        if (ancestors.includes(value)) {
            return '[Circular]';
        }
        ancestors.push(value);
        return value;
    };
}

const formatTableEntry = (value?: any) => {
    if (isValidDate(value)) return value.toString();
    if (isObject(value)) return JSON.stringify(value, getCircularReplacer()); // stringify objects even with circular references
    return value;
};

export interface IOutTableProps {
    rows: any[][], // rows are an array of arrays, each row is an array of values (corresponding to a row in the Excel file)
    columns: {
        key: number,
        name?: string,
    }[],
    // data?: any[], // assume data is a json object that needs to be converted to rows and columns
    selectedColumns?: string[], // specify columns you want printed to screen, default to All
    columnFormatter?: { [key: string]: (arg: any) => any },
    showRowNumbers?: boolean,
    renderRowNum?: (row: any, index: number) => string,
    showHeaderRow?: boolean,
    columnNamesInHeaderRow?: boolean,
    className?: string,
    tableClassName?: string,
    tableHeaderRowClass: string,
}

export function OutTable(props: IOutTableProps) {
    const {
        rows, columns, selectedColumns, columnFormatter, showRowNumbers = false, renderRowNum, showHeaderRow = true, columnNamesInHeaderRow = true,
        className, tableClassName, tableHeaderRowClass,
    } = props;

    const data = preprocessData(rows, columns, columnNamesInHeaderRow, selectedColumns, columnFormatter);
    // TODO: throw error if no columns or rows?

    return (
        <div className={className}>
            <table className={tableClassName}>
                <tbody>
                    <tr>
                        {showHeaderRow && showRowNumbers && <th className={tableHeaderRowClass || ''} />}
                        {
                            data.cols?.map((c) => <th key={c.key} className={!isNull(c.key) ? tableHeaderRowClass : ''}>{!isNull(c.key) ? c.name : ''}</th>)
                        }
                    </tr>
                    {data.rows?.map((r, i) => (
                        <tr key={i}>
                            {showRowNumbers && <td key={i} className={tableHeaderRowClass}>{isFunction(renderRowNum) ? renderRowNum(r, i) : i}</td>}
                            {data.cols?.map((c) => <td key={c.key}>{ formatTableEntry(r[c.key]) }</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function makeCols(refstr: any) {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1; // number of columns
    for (let i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i }; // { name: 'A', key: 0 }, ..., { name: 'Z', key: 25 }, { name: 'AA', key: 26 }, ...
    }
    return o;
}

export function ExcelRenderer(file: File, callback: any) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
            /* Parse data */
            const bstr = e.target?.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array', cellDates: true });

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const cols = makeCols(ws['!ref']); // ws['!ref'] is sheet-range, e.g. 'A1:AM1001'

            const data = { rows: json, cols };

            resolve(data);
            return callback(null, data);
        };
        if (file && rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    });
}
