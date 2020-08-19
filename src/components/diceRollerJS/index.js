import { getTinyliciousContainer } from "@fluidframework/get-tinylicious-container";
import { getDefaultObjectFromContainer } from "@fluidframework/aqueduct";
import { DiceRollerView } from "./DiceRollerView";
import { DiceRollerContainer } from "./DiceRollerContainer";
// Since this is a single page fluid application we are generating a new document id
// if one was not provided
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
    const defaultObject = await getDefaultObjectFromContainer(container);
    // Render the content using standard JavaScript/HTML
    let diceRollerView = new DiceRollerView(defaultObject, document.getElementById("content"));
    diceRollerView.render();
    // Setting "fluidStarted" is just for our test automation
    // eslint-disable-next-line dot-notation
    window["fluidStarted"] = true;
}
start().catch((e)=> {
    console.error(e);
    console.log(
        "%cEnsure you are running the Tinylicious Fluid Server\nUse:`npm run start:server`",
        "font-size:30px");
});