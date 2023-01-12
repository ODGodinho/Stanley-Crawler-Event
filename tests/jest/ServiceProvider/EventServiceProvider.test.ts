import { ContainerName } from "../../../src/app/Enums";
import { container } from "../SingletonTest";

describe("EventServiceProvider Test", () => {
    test("EventServiceProvider Boot", async () => {
        const eventProvider = container.get(ContainerName.EventServiceProvider);
        await expect(eventProvider.boot()).resolves.toBeUndefined();
    });

    test("EventServiceProvider Shutdown", async () => {
        const eventProvider = container.get(ContainerName.EventServiceProvider);
        await expect(eventProvider.shutdown()).resolves.toBeUndefined();
    });
});
