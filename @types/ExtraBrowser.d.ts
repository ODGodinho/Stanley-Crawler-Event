import type {
    Browser as BrowserBase,
    Context as ContextBase,
    Page as PageBase,
} from "../src/Browser";

declare module "playwright" {
    interface Page extends PageBase { }

    interface Frame extends PageBase { }

    interface BrowserContext extends ContextBase { }

    interface Browser extends BrowserBase { }
}

/*
 * NOTE: Use bellow example for use puppeteer or puppeteer-extra
 * https://github.com/ODGodinho/Stanley-Crawler-Event#-change-to-puppeteer
 */
