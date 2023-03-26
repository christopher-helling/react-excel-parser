/* eslint-disable react/no-array-index-key */
import * as XLSX from 'xlsx';

export interface IOutTableProps {
    className?: string;
    tableClassName?: string;
    tableHeaderRowClass: string;
    withZeroColumn?: boolean;
    withoutRowNum?: boolean;
    columns?: {
        key?: string;
        name?: string;
    }[],
    data: any[],
    renderRowNum?: (row: any, index: number) => string,
}

export function OutTable(props: IOutTableProps) {
    const {
        className, tableClassName, tableHeaderRowClass, withZeroColumn, withoutRowNum, columns, data, renderRowNum,
    } = props;

    return (
        <div className={className}>
            <table className={tableClassName}>
                <tbody>
                    <tr>
                        {withZeroColumn && !withoutRowNum && <th className={tableHeaderRowClass || ''} />}
                        {
                            columns?.map((c) => <th key={c.key} className={c.key ? tableHeaderRowClass : ''}>{c.key ? '' : c.name}</th>)

                        }
                    </tr>
                    {data.map((r, i) => (
                        <tr key={i}>
                            {!withoutRowNum && <td key={i} className={tableHeaderRowClass}>{renderRowNum ? renderRowNum(r, i) : i}</td>}
                            {columns?.map((c) => <td key={c.key}>{ r[c.key] }</td>)}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function makeCols(refstr: any) {
    const o = [];
    const C = XLSX.utils.decode_range(refstr).e.c + 1;
    for (let i = 0; i < C; ++i) {
        o[i] = { name: XLSX.utils.encode_col(i), key: i };
    }
    return o;
}

export function ExcelRenderer(file, callback) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const rABS = !!reader.readAsBinaryString;
        reader.onload = (e) => {
        /* Parse data */
            const bstr = e.target?.result;
            const wb = XLSX.read(bstr, { type: rABS ? 'binary' : 'array' });

            /* Get first worksheet */
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];

            /* Convert array of arrays */
            const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
            const cols = makeCols(ws['!ref']);

            const data = { rows: json, cols };

            resolve(data);
            return callback(null, data);
        };
        if (file && rABS) reader.readAsBinaryString(file);
        else reader.readAsArrayBuffer(file);
    });
}
