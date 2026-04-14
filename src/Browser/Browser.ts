import { Browser as BrowserBase } from "@odg/chemical-x";

import type {
    BrowserClassEngine,
    ContextClassEngine,
    ContextOptionsEngine,
    PageClassEngine,
} from "../engine";

export class Browser extends BrowserBase<
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public override async defaultContextOptions(): Promise<ContextOptionsEngine> {
        return {
            ...await super.defaultContextOptions(),
        };
    }

}
