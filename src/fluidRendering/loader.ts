/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import { ContainerRuntimeFactoryWithDefaultDataStore } from '@fluidframework/aqueduct';
import { IProxyLoaderFactory } from "@fluidframework/container-definitions";
import { Loader, Container } from '@fluidframework/container-loader';

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

// const defaultOptions: RouteOptions = {
//     mode: "local",
// }

// export async function getFluidObjects(
//     fluidExport: any,
//     documentId: string,
//     options: RouteOptions = defaultOptions) {
//     const codeDetails: IFluidCodeDetails = {
//         package: "storybook-pkg",
//         config: {},
//     };

//     // Create a Loader and a Container for the first client.
//     const { loader: loader1, urlResolver: urlResolver1 } = await getLoader(fluidExport, documentId, options);
//     const container1 = await loader1.createDetachedContainer(codeDetails);
//     const attachUrl1 = await urlResolver1.createRequestForCreateNew(documentId);
//     await container1.attach(attachUrl1);
//     // Get the Fluid object from the first Container.
//     const fluidObject1 = await getFluidObject(container1, "/");

//     // Create a second Loader and get the Container with 'documentId'.
//     const { loader: loader2, urlResolver: urlResolver2 } = await getLoader(fluidExport, documentId, options);
//     const attachUrl2 = await urlResolver2.getAbsoluteUrl(container1.resolvedUrl!, "");
//     const container2 = await loader2.resolve({ url: attachUrl2 });
//     // Get the Fluid object from the second Container.
//     const fluidObject2 = await getFluidObject(container2, "/");

//     return { fluidObject1, fluidObject2 };
// }

export async function getLoader(
    fluidExport: ContainerRuntimeFactoryWithDefaultDataStore,
    documentId: string,
    options: RouteOptions,
) {
    const urlResolver = new MultiUrlResolver(window.location.origin, documentId, options);

    const codeLoader = new StorybookCodeLoader(fluidExport);
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

export async function getFluidObject(container: Container, objectUrl: string) {
    const response = await container.request({
        headers: {
            mountableView: true,
        },
        url: objectUrl, // Local data object name
    });

    if (response.status !== 200 || !(response.mimeType === "fluid/object")) {
        throw new Error(`Could not load Fluid object ${objectUrl}`);
    }

    return response.value;
}
