import "reflect-metadata";
import "vitest/globals.d.ts";

import { container } from "./SingletonTest";

export default void (async (): Promise<void> => {
    process.env = {
        ...process.env,
        USE_HEADLESS: "true",
    };

    await container.setUp();
})();
