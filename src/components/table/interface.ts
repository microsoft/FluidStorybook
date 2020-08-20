/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventEmitter } from "events";

/**
 * IFluidTable describes the public API surface for the FluidTable component.
 */
export interface IFluidTable extends EventEmitter {
    /**
     * Returns the number of rows in the table.
     */
    readonly rows: number;

    /**
     * Returns the number of columns in the table.
     */
    readonly cols: number;

    /**
     * Returns the value in the cell at row number `row` and column number `col`.
     */
    getCell(row: number, col: number): string | undefined | null;

    /**
     * Inserts `count` number of rows starting at `rowStart`.
     */
    insertRows(rowStart: number, count: number): void;

    /**
     * Inserts `count` number of columns starting at `colStart`.
     */
    insertCols(colStart: number, count: number): void;

    /**
     * Sets a value in the cell at row number `row` and column number `col`.
     */
    setCell(row: number, col: number, value: string): void;

    /**
     * This event is fired when the number of rows in the table changes.
     */
    on(event: "rowsChanged", listener: (rows: number) => void): this;

    /**
     * This event is fired when the number of columns in the table changes.
     */
    on(event: "colsChanged", listener: (cols: number) => void): this;

    /**
     * This event is fired when the value change in the cell at row number `row` and column number `col`.
     */
    on(event: "cellChanged", listener: (row: number, col: number, value: string) => void): this;
}
