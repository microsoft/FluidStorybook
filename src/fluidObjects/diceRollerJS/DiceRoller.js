/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
    DataObject, 
    DataObjectFactory, 
} from "@fluidframework/aqueduct";

const diceValueKey = "diceValueKey";

/**
 * This is our FluidObject. It contains the logic for interacting with the Fluid Framework.
 */
export class DiceRoller extends DataObject {
    static get DataObjectName() { return "@fluid-example/dice-roller"; }

    /**
     * The PrimedComponentFactory declares the component and defines any additional distributed data structures.
     * To add a SharedSequence, SharedMap, or any other structure, put it in the array below.
     */
    static factory = new DataObjectFactory(
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
    async initializingFirstTime() {
        this.root.set(diceValueKey, 1);
    }

    async hasInitialized() {
        this.root.on("valueChanged", (changed) => {
            if (changed.key === diceValueKey) {
                this.emit("diceRolled");
            }
        });
    }

    get id() {
        return this.context.documentId;
    }

    get value() {
        return this.root.get(diceValueKey);
    }

    roll = () => {
        const rollValue = Math.floor(Math.random() * 6) + 1;
        this.root.set(diceValueKey, rollValue);
    };
}
