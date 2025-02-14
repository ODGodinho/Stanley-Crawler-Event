import { chromium } from "playwright-core";

import { ContainerName } from "@enums";
import { ExampleCrawlerService } from "@services/ExampleCrawlerService";

import { container } from "../SingletonTest";

function bind(): undefined {
    return 1 as unknown as undefined;
}

describe("Container Test", () => {
    test("Container GetAsync", async () => {
        container.bind(ContainerName.Browser)
            .toConstantValue(
                await container.get(ContainerName.BrowserManager)
                    .newBrowser(async () => chromium.launch()),
            );

        const service = await container.getAsync(ContainerName.ExampleCrawlerService);

        expect(service).toBeInstanceOf(ExampleCrawlerService);
        expect(service).toHaveProperty("log");

        expect(service["log"]).not.toBeUndefined();
        container.container.unbind(ContainerName.Browser);
    });

    test.concurrent("Test isBound", async () => {
        const containerName = "Example" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();

        container.bind(containerName)
            .toDynamicValue(bind)
            .inSingletonScope();

        expect(container.isBound(containerName)).toBeTruthy();
        expect(container.getOptional(containerName)).toBe(1);
    });

    test("Test getOptional", async () => {
        const containerName = "Example2" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();
        expect(container.getOptional(containerName)).toBeUndefined();
    });

    test.concurrent("Test getOptional", async () => {
        const containerName = "Example2" as ContainerName;

        expect(container.getOptional(containerName)).toBeUndefined();
        expect(container.getOptional(ContainerName.Logger)).not.toBeUndefined();
    });
});

describe.each(Object.values(ContainerName))("Container Instances Test", (containerName: ContainerName) => {
    test(`ContainerName: ${containerName}`, async () => {
        expect(() => container.getOptional(containerName)).not.toThrowError();
    });
});
