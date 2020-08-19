import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import { DiceRoller } from "./DiceRoller";

/**
 * This does setup for the Fluid Container. The ContainerRuntimeFactoryWithDefaultComponent also enables
 * dynamic loading in the EmbeddedComponentLoader.
 *
 * There are two important things here:
 * 1. Default Component name
 * 2. Map of string to factory for all components
 *
 * In this example, we are only registering a single component, but more complex examples will register multiple
 * components.
 */
export const DiceRollerContainer = new ContainerRuntimeFactoryWithDefaultDataStore(
    DiceRoller.DataObjectName,
    new Map([
        [DiceRoller.DataObjectName, Promise.resolve(DiceRoller.factory)],
    ]),
);
