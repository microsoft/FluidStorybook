/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React from "react";

import { DiceRoller } from "./DiceRoller";

interface IAppProps {
    model: DiceRoller;
    sbs: "left" | "right" // is display rendered left or right side
}

/**
 * The entirety of the View logic is encapsulated within the App.
 * The App uses the provided model to interact with Fluid.
 */
export const DiceRollerView = (props: IAppProps) => {
    const [diceValue, setDiceValue] = React.useState(props.model.value);

    // Setup a listener that 
    React.useEffect(() => {
        const onDiceRolled = () => {
            const newValue = props.model.value;
            setDiceValue(newValue);
        };
        props.model.on("diceRolled", onDiceRolled);
        return () => {
            // When the view dismounts remove the listener to avoid memory leaks
            props.model.off("diceRolled", onDiceRolled);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
    const diceChar = String.fromCodePoint(0x267F + diceValue);
    const diceColor = `hsl(${diceValue * 60}, 70%, 50%)`;

    return (
        <div>
            <div aria-live='polite' aria-label={`${props.sbs} dice value is ${diceValue}`} style={{ fontSize: 200, color: diceColor }}><span aria-hidden="true">{diceChar}</span></div>
            <button style={{ fontSize: 50, marginLeft: 10 }} onClick={props.model.roll}>Roll</button>
        </div>
    );
};
