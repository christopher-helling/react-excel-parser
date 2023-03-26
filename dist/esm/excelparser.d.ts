/// <reference types="react" />
export interface IOutTableProps {
    className?: string;
    tableClassName?: string;
    tableHeaderRowClass: string;
    withZeroColumn?: boolean;
    withoutRowNum?: boolean;
    columns?: {
        key?: string;
        name?: string;
    }[];
    data: any[];
    renderRowNum?: (row: any, index: number) => string;
}
export declare function OutTable(props: IOutTableProps): JSX.Element;
export declare function ExcelRenderer(file: any, callback: any): Promise<unknown>;
