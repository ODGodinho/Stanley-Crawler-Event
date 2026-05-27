import { chromium } from "playwright";

import { ContainerName } from "../../../src/app/Enums/index.js";
import { ExampleCrawlerService } from "../../../src/app/Services/index.js";
import { container } from "../SingletonTest.js";

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
        expect(service).toHaveProperty("logger");

        expect(service["logger"]).not.toBeUndefined();
        await container.unbindAsync(ContainerName.Browser);
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

describe("Container Instances Test", () => {
    beforeAll(async () => {
        await container.get(ContainerName.Kernel).boot();
    });

    describe.each(Object.values(ContainerName))("Container Instances Test", (containerName: ContainerName) => {
        test(`ContainerName: ${containerName}`, async () => {
            expect(() => container.get(containerName)).not.toThrow();
        });
    });
});
