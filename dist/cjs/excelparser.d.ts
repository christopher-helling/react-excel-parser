/// <reference types="react" />
export type ParsedExcelFile = {
    rows: any[];
    cols: {
        key: number;
        name?: string;
    }[];
};
export declare function convertExcelRowsToJson(file: ParsedExcelFile, columnNamesInHeaderRow?: boolean, selectedColumns?: string[]): any[];
export interface IOutTableProps {
    rows: any[][];
    columns: {
        key: number;
        name?: string;
    }[];
    selectedColumns?: string[];
    showRowNumbers?: boolean;
    renderRowNum?: (row: any, index: number) => string;
    showHeaderRow?: boolean;
    columnNamesInHeaderRow?: boolean;
    className?: string;
    tableClassName?: string;
    tableHeaderRowClass: string;
}
export declare function OutTable(props: IOutTableProps): JSX.Element;
export declare function ExcelRenderer(file: File, callback: any): Promise<unknown>;
