import crypto from "node:crypto";

import { type PageInterface } from "@odg/chemical-x";
import { injectable } from "inversify";

import {
    type GoogleSearchSelectorsType,
    googleSearchSelectors,
} from "../../Selectors";
import { BasePage } from "../BasePage";

@injectable()
export class SearchPage extends BasePage implements PageInterface {

    public $s: GoogleSearchSelectorsType = googleSearchSelectors;

    /**
     * Execute this step
     *
     * @returns {Promise<void>}
     */
    public async execute(): Promise<void> {
        await this.start(async () => {
            await this.preStart();
            await this.page.goto("https://www.google.com/", { timeout: 8000, waitUntil: "domcontentloaded" });
            await this.fillSearch();
            await this.search();
        });
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
        const numberOfCharsHex = 5;
        await this.page.fill(this.$s.searchInput, crypto.randomBytes(numberOfCharsHex).toString("hex"));
    }

    /**
     * Number of attempt this step
     *
     * @returns {Promise<number>}
     * @memberof SearchPage
     */
    public async attempt(): Promise<number> {
        return 1;
    }

}
