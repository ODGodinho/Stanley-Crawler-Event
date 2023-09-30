import "reflect-metadata";
import "vitest/globals.d.ts";

import { container } from "./SingletonTest";

export default void (async (): Promise<void> => {
    process.env = {
        ...process.env,
        USE_HEADLESS: "true",
        HANDLER_TIMEOUT: "5000",
        HANDLER_ATTEMPT: "1",
        PAGE_ATTEMPT: "1",
    };

    await container.setUp();
})();
