import { Context as ContextBase, type PageOptionsLibraryInterface } from "@odg/chemical-x";

import type {
    ContextClassEngine,
    PageClassEngine,
} from "../engine";

export class Context extends ContextBase<
    ContextClassEngine,
    PageClassEngine
> {

    public override async defaultPageOptions(): Promise<PageOptionsLibraryInterface> {
        return {
            ...await super.defaultPageOptions(),
        };
    }

}
