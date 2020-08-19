/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from "uuid";
import { IFluidCodeDetails } from "@fluidframework/container-definitions";
import { Container } from '@fluidframework/container-loader';
import { getLoader, getFluidObject, RouteOptions } from './loader';
import { renderFluidDataObjects } from './renderer';

// A cache of the document id per demo component's factory.
const documentIdCache = new Map<any, string>();

export const FluidLoader = (props: React.PropsWithChildren<any>) => { 
    const fluidNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function render() {
            // Add loader creation code here
            const fluidExport = props.factory;
            const codeDetails: IFluidCodeDetails = {
                package: "storybook-pkg",
                config: {},
            };
            // Empty string means get the default DataObject from container
            // You could also grab a specific component from the container using "nameOfDataObject"
            // For example in DiceRoller you could use "@fluid-example/dice-roller"
            const dataObjectName = "";
            let mode: RouteOptions = { mode: "local" };

            // Check if we already have created a document for this Fluid factory in this session. If so, load the
            // existing document instead of creating a new one.
            let createDocument: boolean = false;
            let documentId = documentIdCache.get(props.factory);
            if (documentId === undefined) {
                // A document does not exist for this session. Create a documentId to be used to create a new document
                // and set the 'createDocument' flag to true.
                documentId = uuid();
                documentIdCache.set(props.factory, documentId);
                createDocument = true;
            }

            let container1: Container;
            // Create a Loader for the first client.
            const { loader: loader1, urlResolver: urlResolver1 } = await getLoader(fluidExport, documentId, mode);
            // If the 'createDocument' flag is set, create a new container. Otherwise, load an existing one with the 'documentId'.
            if (createDocument) {
                container1 = await loader1.createDetachedContainer(codeDetails);
                const documentUrl1 = await urlResolver1.createRequestForCreateNew(documentId);
                await container1.attach(documentUrl1);
            } else {
                const documentLoadUrl = `${window.location.origin}/${documentId}`;
                container1 = await loader1.resolve({ url: documentLoadUrl });
            }

            // Get the Fluid DataObject from the first Container.
            const fluidDataObject1 = await getFluidObject(container1, dataObjectName);

            // Create a second Loader and load the Container with 'documentId'.
            const { loader: loader2, urlResolver: urlResolver2 } = await getLoader(fluidExport, documentId, mode);
            const documentLoadUrl2 = await urlResolver2.getAbsoluteUrl(container1.resolvedUrl, "");
            const container2 = await loader2.resolve({ url: documentLoadUrl2 });

            // Get the Fluid DataObject from the second Container.
            const fluidDataObject2 = await getFluidObject(container2, dataObjectName);

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
            <h1>{convertToTitle(props.factory.defaultDataObjectName)}</h1>
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