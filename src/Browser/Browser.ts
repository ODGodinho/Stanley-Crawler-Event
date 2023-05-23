import { Browser as BrowserBase } from "@odg/chemical-x";

import {
    type BrowserClassEngine,
    type BrowserOptionsEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,

    type PageClassEngine,
} from "../engine";

export class Browser extends BrowserBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

    public async browserOptions(): Promise<BrowserOptionsEngine> {
        return {
            ...await super.browserOptions(),
            args: [
                "--no-zygote", // Use this to working in docker
            ],
            headless: false,
        };
    }

    public async setUp(): Promise<this> {
        this.$browserInstance = await this.$browserEngine.launch(await this.browserOptions());

        return this;
    }

}
