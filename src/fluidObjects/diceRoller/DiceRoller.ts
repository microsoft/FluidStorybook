/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    DataObject, // New Name
    DataObjectFactory, // New Name
} from "@fluidframework/aqueduct";
import { IValueChanged } from "@fluidframework/map";

const diceValueKey = "diceValueKey";

/**
 * This is our FluidObject. It contains the logic for interacting with the Fluid Framework.
 */
export class DiceRoller extends DataObject {
    public static get DataObjectName() { return "@fluid-example/dice-roller"; }

    /**
     * The PrimedComponentFactory declares the component and defines any additional distributed data structures.
     * To add a SharedSequence, SharedMap, or any other structure, put it in the array below.
     */
    public static factory = new DataObjectFactory(
        DiceRoller.DataObjectName,
        DiceRoller,
        [],
        {},
    );

    /**
     * componentInitializingFirstTime is called only once, it is executed only by the first client to open the
     * component and all work will resolve before the view is presented to any user.
     *
     * This method is used to perform component setup, which can include setting an initial schema or initial values.
     */
    protected async initializingFirstTime() {
        this.root.set(diceValueKey, 1);
    }

    protected async hasInitialized() {
        this.root.on("valueChanged", (changed: IValueChanged) => {
            if (changed.key === diceValueKey) {
                this.emit("diceRolled");
            }
        });
    }

    public get id(): string {
        return this.context.documentId;
    }

    public get value(): number {
        return this.root.get(diceValueKey);
    }

    public readonly roll = () => {
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.root.set(diceValueKey, rollValue);
    };
}
