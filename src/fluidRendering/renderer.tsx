/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React from "react";
import ReactDOM from "react-dom";
import { HTMLViewAdapter } from "@fluidframework/view-adapters";

export async function renderFluidDataObjects(props: any, dataObject1: any, dataObject2: any, fluidObjectUrl: string = "") {

    return new Promise(async (resolve, reject) => {
        // Create container div that Fluid object will be rendered into for server demos
        return await renderFluidObjectsSidebySide(props, dataObject1, dataObject2, fluidObjectUrl, resolve);
    });
    
}

async function renderFluidObjectsSidebySide(props: any, dataObject1: any, dataObject2: any, fluidObjectUrl: string, resolve: any) {
    const { leftDiv, rightDiv, sideBySideDiv } = getSideBySideDivs();

    if (props.view) {
        // Convert props value to enum to ensure they pass allowed value
        switch (props.viewType) {
            case 'js':
                return createDomView(props, dataObject1, dataObject2, resolve);
            case 'react':
                return createReactView(props, dataObject1, dataObject2, resolve);
        }
    }
    else {
        // Load and render the Fluid object since it has it's own render() function
        await renderFluidObject(dataObject1, fluidObjectUrl, leftDiv as HTMLDivElement);
        await renderFluidObject(dataObject2, fluidObjectUrl, rightDiv as HTMLDivElement);
        return resolve(sideBySideDiv);
    }
}

async function createDomView(props: any, dataObject1: any, dataObject2: any, resolve: any) {
    // Create side by side view of Fluid object for local demos
    let { leftDiv, rightDiv, sideBySideDiv} = getSideBySideDivs();
    let leftFluidObject = new props.view(dataObject1, leftDiv);
    leftFluidObject.render();
    let rightFluidObject = new props.view(dataObject2, rightDiv);
    rightFluidObject.render();
    return resolve(sideBySideDiv);
}

async function createReactView(Props: any, dataObject1: any, dataObject2: any, resolve: any) {
    // Create side by side view of Fluid object for local demos
    let { leftDiv, rightDiv, sideBySideDiv} = getSideBySideDivs();
    ReactDOM.render(<Props.view model={dataObject1} {...Props} />, leftDiv);
    ReactDOM.render(<Props.view model={dataObject2} {...Props} />, rightDiv);
    return resolve(sideBySideDiv);
}

async function renderFluidObject(dataObject: any, url: string, div: HTMLDivElement) {
    // let fluidObject = await getFluidObject(dataObject, url);

    // if (fluidObject === undefined) {
    //     return;
    // }

    // We should be retaining a reference to mountableView long-term, so we can call unmount() on it to correctly
    // remove it from the DOM if needed.
    // SamsNotes: Typically I'd rather this get moved into HTMLViewAdapter, create something like UMD
    // https://github.com/umdjs/umd
    if (dataObject.IFluidMountableView) {
        dataObject.mount(div);
        return;
    }

    // If we don't get a mountable view back, we can still try to use a view adapter.  This won't always work (e.g.
    // if the response is a React-based Fluid object using hooks) and is not the preferred path, but sometimes it
    // can work.
    console.warn(`Container returned a non-IFluidObjectMountableView.  This can cause errors when mounting fluid objects `
        + `with React hooks across bundle boundaries.  URL: ${url}`);
    const view = new HTMLViewAdapter(dataObject);
    view.render(div, { display: "block" });
}

export function getSideBySideDivs() {
    const sideBySideDiv = document.createElement('div');
    sideBySideDiv.style.display = "flex";
    const leftDivContainer = makeSideBySideDiv("sbs-left");
    const leftDiv = leftDivContainer.querySelector('.browser .body');
    const rightDivContainer = makeSideBySideDiv("sbs-right");
    const rightDiv = rightDivContainer.querySelector('.browser .body');
    sideBySideDiv.append(leftDivContainer, rightDivContainer);
    return { leftDiv, rightDiv, sideBySideDiv };
}

function makeSideBySideDiv(divId: string) {
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
    div.classList.add('flex');
    // div.style.flexGrow = "1";
    // div.style.justifyContent = 'space-between';
    // div.style.width = "50%"; // ensure the divs don't encroach on each other
    // // div.style.border = "1px solid lightgray";
    // div.style.boxSizing = "border-box";
    // div.style.position = "relative"; // Make the new <div> a CSS containing block.
    div.id = divId;
    return div;
}