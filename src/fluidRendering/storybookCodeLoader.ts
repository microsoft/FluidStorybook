/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ContainerRuntimeFactoryWithDefaultDataStore } from "@fluidframework/aqueduct";
import {
  ICodeLoader,
  IFluidCodeDetails,
  IProvideRuntimeFactory,
} from "@fluidframework/container-definitions";
import { IProvideFluidDataStoreFactory } from "@fluidframework/runtime-definitions";
import { FluidEntryPoint } from "./fluidLoader";

export class StorybookCodeLoader implements ICodeLoader {
  private readonly entryPoint: FluidEntryPoint;

  constructor(entryPoint: FluidEntryPoint) {
    this.entryPoint = entryPoint;
  }

  public async load(source: IFluidCodeDetails) {
    const factory: Partial<IProvideRuntimeFactory & IProvideFluidDataStoreFactory> =
            this.entryPoint.fluidExport ?? this.entryPoint;

    const runtimeFactory: IProvideRuntimeFactory =
        factory.IRuntimeFactory ??
        new ContainerRuntimeFactoryWithDefaultDataStore("default", [["default", Promise.resolve(factory)]]);

    return { fluidExport: runtimeFactory };
  }
}