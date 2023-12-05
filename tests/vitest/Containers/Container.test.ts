import { ContainerName } from "@enums";
import { ExampleCrawlerService } from "@services/ExampleCrawlerService";

import { container } from "../SingletonTest";

describe("Container Test", () => {
    test.concurrent("Container GetAsync", async () => {
        const service = await container.getAsync(ContainerName.ExampleCrawlerService);

        expect(service).toBeInstanceOf(ExampleCrawlerService);
        expect(service).toHaveProperty("log");

        expect(service["log"]).not.toBeUndefined();
    });

    test.concurrent("Test isBound", async () => {
        const containerName = "Example" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();

        container.bind(containerName)
            .toDynamicValue(() => void 0)
            .inSingletonScope();

        expect(container.isBound(containerName)).toBeTruthy();
    });

    test.concurrent("Test getOptional", async () => {
        const containerName = "Example2" as ContainerName;

        expect(container.getOptional(containerName)).toBeUndefined();
        expect(container.getOptional(ContainerName.ExampleCrawlerService)).not.toBeUndefined();
    });
});
