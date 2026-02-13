import { Browser as BrowserBase } from "@odg/chemical-x";

import type {
    ContextOptionsEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine,
} from "../engine";

export class Browser extends BrowserBase<
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public async defaultContextOptions(): Promise<ContextOptionsEngine> {
        return {
            ...await super.defaultContextOptions(),
        };
    }

}
