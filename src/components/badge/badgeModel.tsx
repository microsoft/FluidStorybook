/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { DataObject, DataObjectFactory, ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { SharedCell } from "@fluidframework/cell";
import { IFluidHandle } from "@fluidframework/core-interfaces";
import { SharedMap } from "@fluidframework/map";
import { SharedObjectSequence } from "@fluidframework/sequence";
import { IFluidHTMLView } from "@fluidframework/view-interfaces";
import { IBadgeModel, IBadgeHistory } from "./badge.types";
import { defaultItems } from "./helpers";
import { BadgeClient } from "./badgeClient";

export class Badge extends DataObject implements IBadgeModel, IFluidHTMLView {
    currentCell!: SharedCell;
    optionsMap!: SharedMap;
    historySequence!: SharedObjectSequence<IBadgeHistory>;

    public get IFluidHTMLView() { return this; }

    private readonly currentId: string = "value";
    private readonly historyId: string = "history";
    private readonly optionsId: string = "options";

    static factory = new DataObjectFactory(
        'badge',
        Badge,
        [
            SharedMap.getFactory(),
            SharedCell.getFactory(),
            SharedObjectSequence.getFactory(),
        ],
        {},
    );

    /**
     * initializingFirstTime is called only once, it is executed only by the first client to open the Data Object
     * and all work will resolve before the view is presented to any user.
     *
     * This method is used to perform Data Object setup, which can include setting an initial schema or initial values.
     */
    protected async initializingFirstTime() {
        // Create a cell to represent the Badge's current state
        const current = SharedCell.create(this.runtime);
        current.set(defaultItems[0]);
        this.root.set(this.currentId, current.handle);

        // Create a map to represent the options for the Badge
        const options = SharedMap.create(this.runtime);
        defaultItems.forEach((v) => options.set(v.key, v));
        this.root.set(this.optionsId, options.handle);

        // Create a sequence to store the badge's history
        const badgeHistory = SharedObjectSequence.create<IBadgeHistory>(this.runtime);
        badgeHistory.insert(0, [{
            value: current.get(),
            timestamp: new Date(),
        }]);
        this.root.set(this.historyId, badgeHistory.handle);
    }

    /**
     * In order to retrieve values from the SharedDirectory/Map, we must use await, so we need an async function.
     * This function stashes local references to the Shared objects that we want to pass into the React component
     * in render (see FluidReactClient). That way our render method, which cannot be async, can pass in the Shared
     * object refs as props to the React component.
     */
    protected async hasInitialized() {
        [ this.currentCell, this.optionsMap, this.historySequence ] = await Promise.all([
            this.root.get<IFluidHandle<SharedCell>>(this.currentId).get(),
            this.root.get<IFluidHandle<SharedMap>>(this.optionsId).get(),
            this.root.get<IFluidHandle<SharedObjectSequence<IBadgeHistory>>>(this.historyId).get(),
        ]);
    }

    public render(div: HTMLElement) {
        ReactDOM.render(<BadgeClient model={this} />, div);
    }
}

export const BadgeContainerFactory = new ContainerRuntimeFactoryWithDefaultDataStore(
    'badge',
    new Map([['badge', Promise.resolve(Badge.factory)]])
  );
