import { Page as PageBase } from "@odg/chemical-x";

import {
    type BrowserClassEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "../engine";

export class Page extends PageBase<
    BrowserTypeEngine,
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine
> {

}
