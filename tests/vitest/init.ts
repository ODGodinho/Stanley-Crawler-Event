import "reflect-metadata";
import "vitest/globals.d.ts";

import { container } from "./SingletonTest";

export default void (async (): Promise<void> => {
    await container.setUp();
})();
