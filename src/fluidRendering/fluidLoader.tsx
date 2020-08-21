/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from "uuid";
import { IFluidCodeDetails } from "@fluidframework/container-definitions";
import { Container } from '@fluidframework/container-loader';
import { requestFluidObject } from "@fluidframework/runtime-utils";
import { getLoader, RouteOptions } from './loader';
import { renderFluidDataObjects } from './renderer';

export const FluidLoader = (props: React.PropsWithChildren<any>) => { 
    const fluidNodeRef = useRef<HTMLDivElement>(null);
    const [title, setTitle] = useState("");

    useEffect(() => {
        async function render() {
            // Empty string means get the default DataObject from container
            // You could also grab a specific data object from the container using "nameOfDataObject"
            // For example in DiceRoller you could use "@fluid-example/dice-roller"
            const dataObjectName = "";
            let options: RouteOptions = { mode: "local" };
            setTitle(convertToTitle(props.factory.defaultDataObjectName));

            // Create a new Container.
            const container1 = await createFluidContainer(props.factory, options);
            // Get the Fluid DataObject from the first Container.
            const fluidDataObject1 = await requestFluidObject(container1, dataObjectName);

            // Load a second Container from the Container that we created above.
            const container2 = await loadFluidContainer(props.factory, container1, options);
            // Get the Fluid DataObject from the second Container.
            const fluidDataObject2 = await requestFluidObject(container2, dataObjectName);

            // Handle rendering
            let fluidNode = await renderFluidDataObjects(props, fluidDataObject1, fluidDataObject2, "") as HTMLElement;
            fluidNodeRef.current?.appendChild(fluidNode);
        }
        render();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Return initial HTML. Fluid node will be appended after useEffect is processed.
    return (
        <div id="fluid-container">
            <h1>{title}</h1>
            <br />
            <div ref={fluidNodeRef}></div>
        </div>
    );
};

function convertToTitle(value: string) {
    if (value) {
        value = value.replace('@fluid-example/', '');
        value = value.replace(/-/g, ' ');
        let splitWords = value.split(' ');
        if (splitWords.length) {
            for (let i=0;i<splitWords.length;i++) {
                splitWords[i] = splitWords[i].charAt(0).toUpperCase() + splitWords[i].slice(1);
            }
            return splitWords.join(' ');
        }
    }
    return value;
}

// A cache of the document id per fluidExport.
const documentIdCache = new Map<any, string>();

/**
 * Creates a Loader and a Container.
 * If we already have a documentId for the given fluidExport, we use it to load an existing Container.
 * Otherwise, we create a new Container and attach it.
 * @param fluidExport - The entry point into the Container.
 * @param options - The RouteOptions that specify which server to use.
 */
async function createFluidContainer(
    fluidExport: any,
    options: RouteOptions,
): Promise<Container> {
    // Check if we already have created a document for this Fluid factory in this session. If so, load the
    // existing document instead of creating a new one.
    let createDocument: boolean = false;
    let documentId = documentIdCache.get(fluidExport);
    if (documentId === undefined) {
        // A document does not exist for this session. Create a documentId to be used to create a new document
        // and set the 'createDocument' flag to true.
        documentId = uuid();
        documentIdCache.set(fluidExport, documentId);
        createDocument = true;
    }

    let container: Container;
    // Create a Loader for the first client.
    const { loader, urlResolver } = await getLoader(fluidExport, documentId, options);
    // If the 'createDocument' flag is set, create a new container. Otherwise, load an existing one with the 'documentId'.
    if (createDocument) {
        const codeDetails: IFluidCodeDetails = {
            package: "storybook-pkg",
            config: {},
        };

        container = await loader.createDetachedContainer(codeDetails);
        const attachUrl = await urlResolver.createRequestForCreateNew(documentId);
        await container.attach(attachUrl);
    } else {
        const documentLoadUrl = `${window.location.origin}/${documentId}`;
        container = await loader.resolve({ url: documentLoadUrl });
    }

    return container;
}

/**
 * Creates a Loader and loads an existing Container.
 * @param fluidExport - The entry point into the Container.
 * @param fromContainer - The Container from which the new Container is to be created.
 * @param options - The RouteOptions that specify which server to use.
 */
async function loadFluidContainer(
    fluidExport: any,
    fromContainer: Container,
    options: RouteOptions,
): Promise<Container> {
    const { loader, urlResolver } = await getLoader(fluidExport, fromContainer.id, options);
    const documentLoadUrl = await urlResolver.getAbsoluteUrl(fromContainer.resolvedUrl, "");
    const container = await loader.resolve({ url: documentLoadUrl });

    return container;
}
