import "reflect-metadata";
import { container } from "./SingletonTest";

export default void (async (): Promise<void> => {
    await container.setUp();
})();
