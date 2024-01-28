import { type PageOptionsLibraryInterface } from "@odg/chemical-x";
import { Context as ContextBase } from "@odg/chemical-x";

import {
    type ContextClassEngine,
    type PageClassEngine,
} from "../engine";

export class Context extends ContextBase<
    ContextClassEngine,
    PageClassEngine
> {

    public async defaultPageOptions(): Promise<PageOptionsLibraryInterface> {
        return {
            ...await super.defaultPageOptions(),
        };
    }

}
