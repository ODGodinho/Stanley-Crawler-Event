import { NullLogger } from "@odg/log";
import { decorate, injectable } from "inversify";

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

    test("Container SetUp", async () => {
        await expect(container.checkCanRun()).resolves.toBeUndefined();
    });

    test("New Bind Logger", async () => {
        container.container.unbind(ContainerName.Logger);
        decorate(injectable(), NullLogger);

        container.bind(ContainerName.Logger)
            .to(NullLogger)
            .inSingletonScope();

        await expect(container.loadLoggerPlugins()).resolves.toBeUndefined();
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
