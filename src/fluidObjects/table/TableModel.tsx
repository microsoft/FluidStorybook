/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";
import ReactDOM from "react-dom";
import { 
    DataObject, 
    DataObjectFactory, 
    ContainerRuntimeFactoryWithDefaultDataStore } 
from "@fluidframework/aqueduct";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import { SharedMatrix } from "@fluidframework/matrix";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { IMatrixConsumer, IMatrixProducer } from "@tiny-calc/nano";
import { IFluidTable } from "./interface";
import { TableView } from "./TableView";

const matrixDataStoreKey = "matrixDataStoreKey";

class FluidTable extends DataObject implements IFluidTable, IFluidHTMLView, IMatrixConsumer<string> {
    public get IFluidHTMLView() {
        return this;
    }

    static get FluidObjectName() { return "@fluid-example/Fluid Table"; }

    private _matrixData!: SharedMatrix<string>;

    static factory = new DataObjectFactory(
        FluidTable.FluidObjectName,
        FluidTable,
        [SharedMatrix.getFactory()],
        {},
    );

    protected async initializingFirstTime() {
        const matrixDDSObject = SharedMatrix.create(this.runtime);

        // Insert 4 rows and 4 columns.
        matrixDDSObject.insertRows(0, 4);
        matrixDDSObject.insertCols(0, 4);

        // Set column titles in the first row.
        matrixDDSObject.setCell(0, 0, "Column 1");
        matrixDDSObject.setCell(0, 1, "Column 2");
        matrixDDSObject.setCell(0, 2, "Column 3");
        matrixDDSObject.setCell(0, 3, "Column 4");

        this.root.set(matrixDataStoreKey, matrixDDSObject.handle);
    }

    protected async hasInitialized() {
        const matrixDDSObjectHandle = this.root.get<IFluidHandle<SharedMatrix<string>>>(matrixDataStoreKey);
        this._matrixData = await matrixDDSObjectHandle.get();

        // Call 'openMatrix' to observe changes in the SharedMatrix.
        this._matrixData.openMatrix(this);
    }

    /**
     * Will return a new Table view
     */
    public render(div: HTMLElement) {
        ReactDOM.render(
            <TableView model={this} />,
            div,
        );
        return div;
    }

    // IFluidTable methods
    public get rows(): number {
        return this._matrixData.rowCount;
    }

    public insertRows(rowStart: number, count: number) {
        this._matrixData.insertRows(rowStart, count);
    }

    public get cols(): number {
        return this._matrixData.colCount;
    }

    public insertCols(colStart: number, count: number) {
        this._matrixData.insertCols(colStart, count);
    }

    public getCell(row: number, col: number): string | undefined | null {
        return this._matrixData.getCell(row, col);
    }

    public setCell(row: number, col: number, value: string) {
        this._matrixData.setCell(row, col, value);
    }

    // IMatrixConsumer methods which will be called back when SharedMatrix changes. We will emit events which the
    // Table view listens to.
    public rowsChanged(rowStart: number, removedCount: number, insertedCount: number, producer: IMatrixProducer<string>) {
        this.emit("rowsChanged", this.rows);
    }

    public colsChanged(colStart: number, removedCount: number, insertedCount: number, producer: IMatrixProducer<string>) {
        this.emit("colsChanged", this.cols);
    }

    public cellsChanged(rowStart: number, colStart: number, rowCount: number, colCount: number, producer: IMatrixProducer<string>) {
        this.emit("cellChanged", rowStart, colStart, this.getCell(rowStart, colStart));
    }
}

export const TableContainerFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    FluidTable.FluidObjectName,
    [[FluidTable.FluidObjectName, Promise.resolve(FluidTable.factory)]]
  );
