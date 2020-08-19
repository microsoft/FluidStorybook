import { ICodeLoader, IFluidCodeDetails } from "@fluidframework/container-definitions";
import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";

export class StorybookCodeLoader implements ICodeLoader {
  // eslint-disable-next-line no-useless-constructor
  fluidExport: ContainerRuntimeFactoryWithDefaultDataStore;

  constructor(fluidExport: ContainerRuntimeFactoryWithDefaultDataStore) {
    this.fluidExport = fluidExport;
  }

  public load(source: IFluidCodeDetails) {
    // Normally the "source" parameter would be the package details
    return Promise.resolve({
      fluidExport: this.fluidExport,
    });
  }
}