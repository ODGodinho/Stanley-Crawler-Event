import { Context as ContextBase } from "@odg/chemical-x";

import {
    type ContextOptionsEngine,
    type BrowserClassEngine,
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

    public async contextOptions(): Promise<ContextOptionsEngine> {
        return {
            ...await super.contextOptions(),
        };
    }

}
