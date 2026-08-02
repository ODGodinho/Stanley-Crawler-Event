import { detach, Str } from "@odg/chemical-x";
import { test as base } from "vitest";

import type {
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine,
} from "#engine";
import { ContainerName } from "#enums";

import { container } from "../setup/container.js";

interface BrowserFixtures {
    browser: BrowserClassEngine;
    context: ContextClassEngine;
    page: PageClassEngine;
}

const artifactsDirectory = "tests/.results";

/**
 * `test` estendido com fixtures de browser (worker/test scope).
 *
 * - `browser` (worker-scope): 1 chromium por worker via `Kernel.createBrowser`.
 * - `context`/`page` (test-scope): isolados, fecham sozinhos (inclusive em falha).
 * - Em falha: trace (`context`) + screenshot (`page`) salvos em `test-results/`.
 */
export const test = base.extend<BrowserFixtures>({
    browser: [
        async ({ }, use): Promise<void> => {
            const browser = await container.get(ContainerName.Kernel).createBrowser();

            await use(browser);
            await browser.close();
        },
        { scope: "worker" },
    ],

    context: async ({ browser, task }, use): Promise<void> => {
        const context = await browser.newContext();

        await context.tracing.start({ screenshots: true, snapshots: true, sources: true });
        await use(context);

        if (task.result?.state === "fail") {
            await context.tracing.stop({ path: `${artifactsDirectory}/${new Str(task.name).snakeCase().toString()}.trace.zip` });
        } else {
            await context.tracing.stop();
        }

        await context.close();
    },

    page: async ({ context, task }, use): Promise<void> => {
        const page = await context.newPage();

        await use(page);

        if (task.result?.state === "fail") {
            await detach(
                page.screenshot({ path: `${artifactsDirectory}/${new Str(task.name).snakeCase().toString()}.png` }),
                null,
            );
        }

        await page.close();
    },
});
