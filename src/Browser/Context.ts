import { Context as ContextBase } from "@odg/chemical-x";

import {
    type BrowserClassEngine,
    type BrowserOptionsEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "../engine";

export class Context extends ContextBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public async contextOptions(): Promise<BrowserOptionsEngine> {
        return {
            ...await super.contextOptions(),
            headless: false,
        };
    }

}
