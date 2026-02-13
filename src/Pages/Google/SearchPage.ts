import crypto from "node:crypto";

import { ODGDecorators, type PageInterface } from "@odg/chemical-x";

import { ConfigName, ContainerName } from "@app/Enums";
import { BasePage } from "@pages/BasePage";
import {
    googleSearchSelector,
    type GoogleSearchSelectorType,
} from "@selectors";

@ODGDecorators.injectablePageOrHandler(ContainerName.SearchPage)
@ODGDecorators.attemptableFlow()
export class SearchPage extends BasePage implements PageInterface {

    public readonly $s: GoogleSearchSelectorType = googleSearchSelector;

    /**
     * Execute this step
     *
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        await this.page.goto("https://www.google.com/", { timeout: 8000, waitUntil: "load" });
        await this.fillSearch();
        await this.search();
    }

    /**
     * Click Search Input
     *
     * @returns {Promise<void>}
     */
    public async search(): Promise<void> {
        return this.page.click(this.$s.buttons.submit);
    }

    /**
     * Fill Search Input
     *
     * @returns {Promise<void>}
     */
    public async fillSearch(): Promise<void> {
        const numberOfCharsHex = 2;

        await this.page.fill(this.$s.searchInput, crypto.randomBytes(numberOfCharsHex).toString("hex"));
    }

    /**
     * Number of attempt this step
     *
     * @memberof SearchPage
     * @returns {Promise<number>}
     */
    public async attempt(): Promise<number> {
        return this.config.get(ConfigName.PAGE_ATTEMPT);
    }

}
