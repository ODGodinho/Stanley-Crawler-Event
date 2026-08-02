import path from "node:path";

import { test } from "../../Helpers/browser.js";

describe("Page fill", () => {
    test.concurrent("Page fill", async ({ page }) => {
        await page.goto(`file://${path.resolve("tests/mock/input.html")}`);

        await expect(page.fill("input", "Godinho")).resolves.toBeUndefined();
        await expect(page.inputValue("input")).resolves.toBe("Godinho");
    });
});
