/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";
import { IFluidObject } from "@fluidframework/core-interfaces";
import { HTMLViewAdapter } from "@fluidframework/view-adapters";
import { FluidLoaderProps } from "./fluidLoader";

export async function renderFluidDataObjects(
    props: FluidLoaderProps,
    dataObject1: IFluidObject,
    dataObject2: IFluidObject,
) {
    return new Promise(async (resolve, reject) => {
        // Create container div that Fluid object will be rendered into for server demos
        return await renderFluidObjectsDivs(props, dataObject1, dataObject2, resolve);
    });
    
}

async function renderFluidObjectsDivs(
    props: FluidLoaderProps,
    dataObject1: IFluidObject,
    dataObject2: IFluidObject,
    resolve: any,
) {
    // Use horizonal layout by default
    const divs = getDivs(props.layout ?? "horizontal");

    if (props.view) {
        // Convert props value to enum to ensure they pass allowed value
        switch (props.viewType) {
            case 'js':
                return createDomView(props, dataObject1, dataObject2, divs, resolve);
            case 'react':
                return createReactView(props, dataObject1, dataObject2, divs, resolve);
        }
    }
    else {
        // Fluid object has it's own render() function
        await renderFluidObject(dataObject1, divs.div1 as HTMLDivElement);
        await renderFluidObject(dataObject2, divs.div2 as HTMLDivElement);
        return resolve(divs.containerDiv);
    }
}

async function createDomView(
    props: FluidLoaderProps,
    dataObject1: IFluidObject,
    dataObject2: IFluidObject,
    divs: any,
    resolve: any,
) {
    // Create side by side view of Fluid object for local demos
    let leftFluidObject = new props.view(dataObject1, divs.div1);
    leftFluidObject.render();
    let rightFluidObject = new props.view(dataObject2, divs.div2);
    rightFluidObject.render();
    return resolve(divs.containerDiv);
}

async function createReactView(props: FluidLoaderProps,
    dataObject1: IFluidObject,
    dataObject2: IFluidObject,
    divs: any,
    resolve: any,
) {
    ReactDOM.render(<props.view model={dataObject1} {...props} />, divs.div1);
    ReactDOM.render(<props.view model={dataObject2} {...props} />, divs.div2);
    return resolve(divs.containerDiv);
}

async function renderFluidObject(dataObject: IFluidObject, div: HTMLDivElement) {
    // We should be retaining a reference to mountableView long-term, so we can call unmount() on it to correctly
    // remove it from the DOM if needed.
    // SamsNotes: Typically I'd rather this get moved into HTMLViewAdapter, create something like UMD
    // https://github.com/umdjs/umd
    if (dataObject.IFluidMountableView) {
        dataObject.IFluidMountableView.mount(div);
        return;
    }

    const view = new HTMLViewAdapter(dataObject);
    view.render(div, { display: "block" });
}

export function getDivs(layout: string) {
    const containerDiv = document.createElement('div');
    const div1Container = makeBrowserShellDiv("sbs-left", layout);
    const div1 = div1Container.querySelector(".browser .body");
    const div2Container = makeBrowserShellDiv("sbs-right", layout);
    const div2 = div2Container.querySelector(".browser .body");
    
    if (layout === 'vertical') {
        const br = document.createElement('br');
        containerDiv.append(div1Container, br, div2Container);
    }
    else {
        containerDiv.style.display = "flex";
        containerDiv.append(div1Container, div2Container);
    }

    return { div1, div2, containerDiv };
}

function makeBrowserShellDiv(divId: string, layout: string) {
    const isWindows = navigator.platform.indexOf('Win') > -1;
    const macControls = (isWindows) ? 'none': 'inline-block';
    const windowsControls = (isWindows) ? 'inline-block': 'none';
    const html = `
    <div class="window browser">
        <div class="header">
            <span class="bullets mac" style="display:${macControls}">
                <span class="bullet bullet-red"></span>
                <span class="bullet bullet-yellow"></span>
                <span class="bullet bullet-green"></span>
            </span>
            <span class="title">
                <span class="scheme">https://</span>your-fluid-app.com
            </span>
            <span class="windows" style="display:${windowsControls}">
                <span class="windows-icon"><div class="windows-min-icon"></div></span>
                <span class="windows-icon"><div class="windows-max-icon"></div></span>
                <span class="windows-icon windows-close-icon">x</span>
            </span>
        </div>
        <div class="body">
            
        </div>
    </div> 
    `;
    const div = document.createElement("div");
    div.innerHTML = html;
    div.id = divId;
    if (layout !== 'vertical') {
        div.classList.add('flex');
    }
    return div;
}