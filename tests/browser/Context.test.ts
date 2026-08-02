import { Context, Page } from "#browser";

import { test } from "../Helpers/browser.js";

describe("Context Create Instance", () => {
    test.concurrent("new Context", async ({ context, page }) => {
        expect(context).toBeInstanceOf(Context);
        expect(page).toBeInstanceOf(Page);
    });
});
