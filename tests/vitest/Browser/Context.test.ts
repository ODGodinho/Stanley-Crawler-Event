import { chromium } from "playwright";

import { Context, Page } from "@browser";
import { ContainerName } from "@enums";

import { container } from "../SingletonTest";

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
