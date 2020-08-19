/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { 
    DataObject, 
    DataObjectFactory, 
    ContainerRuntimeFactoryWithDefaultDataStore } 
from "@fluidframework/aqueduct";

import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import { SharedCounter } from "@fluidframework/counter";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import React from "react";
import ReactDOM from "react-dom";

const counterKey = "counter";

/**
 * Basic Clicker example using new interfaces and stock DataObject classes.
 */
export class Clicker extends DataObject implements IFluidHTMLView {
    public get IFluidHTMLView() {
        return this;
    }

    static get DataObjectName() { return "@fluid-example/clicker"; }

    private _counter: SharedCounter | undefined;

    static factory = new DataObjectFactory(
        Clicker.DataObjectName,
        Clicker,
        [SharedCounter.getFactory()],
        {},
    );

    /**
     * Do setup work here
     */
    protected async initializingFirstTime() {
        const counter = SharedCounter.create(this.runtime);
        this.root.set(counterKey, counter.handle);
    }

    protected async hasInitialized() {
        const counterHandle = this.root.get<IFluidHandle<SharedCounter>>(counterKey);
        this._counter = await counterHandle.get();
    }

    // #region IComponentHTMLView

    /**
     * Will return a new Clicker view
     */
    public render(div: HTMLElement) {
        // Get our counter object that we set in initialize and pass it in to the view.
        ReactDOM.render(
            <CounterReactView counter={this.counter} />,
            div,
        );
        return div;
    }

    // #endregion IComponentHTMLView

    private get counter() {
        if (this._counter === undefined) {
            throw new Error("SharedCounter not initialized");
        }
        return this._counter;
    }
}

// ----- REACT STUFF -----

interface CounterProps {
    counter: SharedCounter;
}

interface CounterState {
    value: number;
}

class CounterReactView extends React.Component<CounterProps, CounterState> {
    constructor(props: CounterProps) {
        super(props);

        this.state = {
            value: this.props.counter.value,
        };
    }

    componentDidMount() {
        this.props.counter.on("incremented", (incrementValue: number, currentValue: number) => {
            this.setState({ value: currentValue });
        });
    }

    render() {
        return (
            <div>
                <span style={{fontSize: 30}} className="clicker-value-class" id={`clicker-value-${Date.now().toString()}`}>
                    {this.state.value}
                </span>
                &nbsp;&nbsp;
                <button style={{fontSize: 20}} onClick={() => { this.props.counter.increment(1); }}>+</button>
            </div>
        );
    }
}

export const ClickerContainerFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    Clicker.DataObjectName,
    new Map([[Clicker.DataObjectName, Promise.resolve(Clicker.factory)]])
  );
