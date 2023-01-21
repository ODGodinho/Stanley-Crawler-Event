import "reflect-metadata";
import { ContainerName } from "../../src/app/Enums";

import { container } from "./SingletonTest";

afterAll(async () => {
    const browser = await container.getAsync(ContainerName.Browser);
    await browser.close();
});

export default void (async (): Promise<void> => {
    await container.setUp();
})();
