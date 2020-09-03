/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import {
  ICodeLoader,
  IFluidCodeDetails,
  IProvideRuntimeFactory,
} from "@fluidframework/container-definitions";

export class StorybookCodeLoader implements ICodeLoader {
  private readonly factory: IProvideRuntimeFactory;

  constructor(factory: IProvideRuntimeFactory) {
    this.factory = factory;
  }

  public load(source: IFluidCodeDetails) {
    // Normally the "source" parameter would be the package details.
    return Promise.resolve({
      fluidExport: this.factory.IRuntimeFactory,
    });
  }

}