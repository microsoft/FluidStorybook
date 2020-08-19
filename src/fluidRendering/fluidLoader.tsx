/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useEffect, useRef } from 'react';
import { v4 as uuid } from "uuid";
import { IFluidCodeDetails } from "@fluidframework/container-definitions";
import { getLoader, getFluidObject, RouteOptions } from './loader';
import { renderFluidDataObjects } from './renderer';

export const FluidLoader = (props: React.PropsWithChildren<any>) => { 
    const fluidNodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function render() {
            // Add loader creation code here
            const fluidExport = props.factory;
            const documentId = uuid();
            const codeDetails: IFluidCodeDetails = {
                package: "storybook-pkg",
                config: {},
            };
            // Empty string means get the default DataObject from container
            // You could also grab a specific component from the container using "nameOfDataObject"
            // For example in DiceRoller you could use "@fluid-example/dice-roller"
            const dataObjectName = ""; 
            let mode: RouteOptions = { mode: "local" };

            // Create a Loader and a Container for the first client.
            const { loader: loader1, urlResolver: urlResolver1 } = await getLoader(fluidExport, documentId, mode);
            const container1 = await loader1.createDetachedContainer(codeDetails);
            const attachUrl1 = await urlResolver1.createRequestForCreateNew(documentId);
            await container1.attach(attachUrl1);

            // Get the Fluid DataObject from the first Container.
            const fluidDataObject1 = await getFluidObject(container1, dataObjectName);

            // Create a second Loader and get the Container with 'documentId'.
            const { loader: loader2, urlResolver: urlResolver2 } = await getLoader(fluidExport, documentId, mode);
            const attachUrl2 = await urlResolver2.getAbsoluteUrl(container1.resolvedUrl, "");
            const container2 = await loader2.resolve({ url: attachUrl2 });

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