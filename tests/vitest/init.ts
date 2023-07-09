import "reflect-metadata";
import "vitest/globals.d.ts";
import { ContainerName } from "@enums";

import { container } from "./SingletonTest";

afterAll(async () => {
    const browser = await container.getAsync(ContainerName.Browser);
    await browser.close();
});

export default void (async (): Promise<void> => {
    await container.setUp();
})();
