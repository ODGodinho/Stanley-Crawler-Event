import { Context, Page } from "@browser";
import { ContainerName } from "@enums";

import { container } from "../SingletonTest";

describe("Context Create Instance", () => {
    test("new Context", async () => {
        const browser = await container.getAsync(ContainerName.Browser);
        const context = await browser.newContext();
        const page = await context.newPage();

        expect(context).toBeInstanceOf(Context);
        expect(page).toBeInstanceOf(Page);
    });
});
