import { ContainerName } from "../../../src/app/Enums";
import { Context, Page } from "../../../src/Browser";
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
