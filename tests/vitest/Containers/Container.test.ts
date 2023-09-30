import { ContainerName } from "@enums";
import { ExampleCrawlerService } from "@services/ExampleCrawlerService";

import { container } from "../SingletonTest";

describe("Container Test", () => {
    test("Container GetAsync", async () => {
        const service = await container.getAsync(ContainerName.ExampleCrawlerService);

        expect(service).toBeInstanceOf(ExampleCrawlerService);
        expect(service).toHaveProperty("log");

        expect(service["log"]).not.toBeUndefined();
    });

    test("Test isBound", async () => {
        const containerName = "Example" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();

        container.bind(containerName)
            .toDynamicValue(() => void 0)
            .inSingletonScope();

        expect(container.isBound(containerName)).toBeTruthy();
    });
});
