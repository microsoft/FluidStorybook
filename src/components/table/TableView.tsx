/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, {useState} from "react";
import { IFluidTable } from "./interface";
import "./styles.css";

interface TableViewProps {
    model: IFluidTable;
};

interface TableViewState {
    rowCount: number;
    colCount: number;
};

export class TableView extends React.Component<TableViewProps, TableViewState> {

    constructor(props: TableViewProps) {
        super(props);

        this.state = {
            rowCount: this.props.model.rows,
            colCount: this.props.model.cols,
        };
    }

    componentDidMount() {
        // Set up event listener to observe when the number of rows and columns change.
        this.props.model.on("rowsChanged", (rowCount: number) => {
            this.setState({rowCount});
        });

        this.props.model.on("colsChanged", (colCount: number) => {
            this.setState({colCount});
        });
    }

    addRow = () => {
        // Insert a new row in the data model.
        this.props.model.insertRows(this.props.model.rows, 1);
    }

    render() {
        const { rowCount, colCount } = this.state;
        const rows = [];
        for (let i = 0; i < rowCount; i++) {
            const cells = []
            for(let j=0;j< colCount;j++){
                cells.push(<Cell model={this.props.model} rowIndex={i} colIndex={j} key={`row_${i}_col_${j}`}/>)
            }
            rows.push(<div className={`row ${i === rowCount-1 ? 'row-last': ''}`} key={`row_${i}`}>{cells}</div>)
        }

        return (
            <div className='table'>
                {rows}
                <div className='actions'><button onClick={this.addRow}>+</button></div>
            </div>
        )
    }
}

interface CellProps {
    model: IFluidTable;
    rowIndex: number;
    colIndex: number;
};

const Cell = function Cell(props: CellProps) {
    const { model, rowIndex, colIndex } = props;
    const [cellContent, setCellContent] = useState(model.getCell(rowIndex, colIndex));
    const [insertMode, setInsertMode] = useState(false);

    const onCellClicked = (e: any) => {
        e.target.focus();
        setInsertMode(true);
    }

    const onBlurCell = (e: any) => {
        setInsertMode(false);
        setCellContent(e.target.textContent);

        // Update the data model with the new cell contents.
        model.setCell(rowIndex, colIndex, e.target.textContent);
    }

    // Set up event listener to observe when the cell data changes.
    model.on("cellChanged", (row: number, col: number, value: string) => {
        if (row === rowIndex && col === colIndex) {
            setCellContent(value);
        }
    });

    return (
        <div className={`cell ${rowIndex === 0 ? 'cell-title' : ''} ${colIndex === model.cols-1 ? 'cell-last-col' : ''}`} onClick={onCellClicked} onBlur={onBlurCell} contentEditable={insertMode}>
            {cellContent}
        </div>
    );
};