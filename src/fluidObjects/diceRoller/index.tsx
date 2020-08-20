import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import React from "react";
import ReactDOM from "react-dom";

import { DiceRollerView } from "./DiceRollerView";
import { DiceRoller } from "./DiceRoller";
import { DiceRollerContainer } from "./DiceRollerContainer";

let createNew = false;
if (window.location.hash.length === 0) {
    createNew = true;
    window.location.hash = Date.now().toString();
}
const documentId = window.location.hash.substring(1);

/**
 * This is a helper function for loading the page. It's required because getting the Fluid Container
 * requires making async calls.
 */
async function start() {
    // Get the Fluid Container associated with the provided id
    const container = await getTinyliciousContainer(documentId, DiceRollerContainer, createNew);
    // Get the Default Object from the Container (DiceRoller)
    const defaultObject = await getDefaultObjectFromContainer<DiceRoller>(container);

    // Render the content using ReactDOM
    ReactDOM.render(
        <DiceRollerView model={defaultObject} />,
        document.getElementById("content"));
}

start().catch((e)=> {
    console.error(e);
    console.log(
        "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
        "font-size:30px");
});
