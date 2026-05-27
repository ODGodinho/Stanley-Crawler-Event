import { chromium } from "playwright";

import { ContainerName } from "../../../src/app/Enums/index.js";
import { Context, Page } from "../../../src/Browser/index.js";
import { container } from "../SingletonTest.js";

describe("Context Create Instance", () => {
    test("new Context", async () => {
        const manager = await container.getAsync(ContainerName.BrowserManager);
        const browser = await manager.newBrowser(async () => chromium.launch({}));
        const context = await browser.newContext();
        const page = await context.newPage();

        expect(context).toBeInstanceOf(Context);
        expect(page).toBeInstanceOf(Page);
    });
});
