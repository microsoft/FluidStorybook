/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { IProxyLoaderFactory } from "@fluidframework/container-definitions";
import { Loader } from '@fluidframework/container-loader';

import { FluidEntryPoint } from "./fluidLoader";
import { getDocumentServiceFactory } from "./multiDocumentServiceFactory";
import { MultiUrlResolver } from "./multiResolver";
import { StorybookCodeLoader } from './storybookCodeLoader';

export interface ILocalRouteOptions {
    mode: "local";
}

export interface ITinyliciousRouteOptions {
    mode: "tinylicious";
}

export type RouteOptions =
    | ILocalRouteOptions
    | ITinyliciousRouteOptions;

export async function getLoader(
    entryPoint: FluidEntryPoint,
    documentId: string,
    options: RouteOptions,
) {
    const urlResolver = new MultiUrlResolver(window.location.origin, documentId, options);

    const codeLoader = new StorybookCodeLoader(entryPoint);
    const documentServiceFactory = getDocumentServiceFactory(documentId, options);
    const loader = new Loader(
        urlResolver,
        documentServiceFactory,
        codeLoader,
        { blockUpdateMarkers: true },
        {},
        new Map<string, IProxyLoaderFactory>());

    return { loader, urlResolver };
}
