/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

// eslint-disable-next-line import/no-internal-modules
import { v4 as uuid } from "uuid";
import { IRequest } from "@fluidframework/core-interfaces";
import { IResolvedUrl, IUrlResolver } from "@fluidframework/driver-definitions";
import { LocalResolver } from "@fluidframework/local-driver";
import { IUser } from "@fluidframework/protocol-definitions";
import { getRandomName } from "@fluidframework/server-services-client";
import { InsecureUrlResolver } from "@fluidframework/test-runtime-utils";

export interface IDevServerUser extends IUser {
    name: string;
}

export const tinyliciousUrls = {
    hostUrl: "http://localhost:3000",
    ordererUrl: "http://localhost:3000",
    storageUrl: "http://localhost:3000",
};

const getUser = (): IDevServerUser => ({
    id: uuid(),
    name: getRandomName(),
});

function getUrlResolver(
    options: any,
): IUrlResolver {
    switch (options.mode) {
        case "tinylicious":
            return new InsecureUrlResolver(
                tinyliciousUrls.hostUrl,
                tinyliciousUrls.ordererUrl,
                tinyliciousUrls.storageUrl,
                "tinylicious",
                "12345",
                getUser(),
                options.bearerSecret);

        default: // Local
            return new LocalResolver();
    }
}

export class MultiUrlResolver implements IUrlResolver {
    private readonly urlResolver: IUrlResolver;
    constructor(
        private readonly rawUrl: string,
        private readonly documentId: string,
        private readonly options: any) {
        this.urlResolver = getUrlResolver(options);
    }

    async getAbsoluteUrl(resolvedUrl: IResolvedUrl, relativeUrl: string): Promise<string> {
        let url = relativeUrl;
        if (url.startsWith("/")) {
            url = url.substr(1);
        }
        return `${this.rawUrl}/${this.documentId}/${url}`;
    }

    async resolve(request: IRequest): Promise<IResolvedUrl | undefined> {
        return this.urlResolver.resolve(request);
    }

    public async createRequestForCreateNew(
        fileName: string,
    ): Promise<IRequest> {
        switch (this.options.mode) {
            case "tinylicious":
                return (this.urlResolver as InsecureUrlResolver).createCreateNewRequest(fileName);
            default: // Local
                return (this.urlResolver as LocalResolver).createCreateNewRequest(fileName);
        }
    }
}