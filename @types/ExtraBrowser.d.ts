import {
    type Browser as BrowserBase,
    type Context as ContextBase,
    type Page as PageBase,
} from "./Browser";

declare module "playwright-core" {
    interface Page extends PageBase { }

    interface Frame extends PageBase { }

    interface BrowserContext extends ContextBase { }

    interface Browser extends BrowserBase { }
}

/*
 * Declare module "puppeteer-core" {
 *     interface Page extends PageBase { }
 *     interface Frame extends PageBase { }
 *     interface BrowserContext extends ContextBase { }
 *     interface Browser extends BrowserBase { }
 * }
 */
