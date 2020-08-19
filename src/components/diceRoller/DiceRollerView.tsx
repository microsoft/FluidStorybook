import React from "react";

import { DiceRoller } from "./DiceRoller";

interface IAppProps {
    model: DiceRoller;
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
    }, [diceValue]);

    // Unicode 0x2680-0x2685 are the sides of a dice (⚀⚁⚂⚃⚄⚅)
    const diceChar = String.fromCodePoint(0x267F + diceValue);
    const diceColor = `hsl(${diceValue * 60}, 70%, 50%)`;

    // Set the Tab Title to the dice char because it's cool,
    // and it makes testing with multiple tabs easier
    document.title = `${diceChar} - ${props.model.id}`;

    return (
        <div>
            <div style={{ fontSize: 200, color: diceColor }}>{diceChar}</div>
            <button style={{ fontSize: 50, marginLeft: 10 }} onClick={props.model.roll}>Roll</button>
        </div>
    );
};
