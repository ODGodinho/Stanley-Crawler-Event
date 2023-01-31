import { NullLogger } from "@odg/log";
import { decorate, injectable } from "inversify";

import { ContainerName } from "../../../src/app/Enums";
import { ExampleCrawlerService } from "../../../src/app/Services/ExampleCrawlerService";
import { container } from "../SingletonTest";

describe("Container Test", () => {
    test("Container GetAsync", async () => {
        const service = await container.getAsync(ContainerName.ExampleCrawlerService);

        expect(service).toBeInstanceOf(ExampleCrawlerService);
        expect(service).toHaveProperty("log");

        expect(service["log"]).not.toBeUndefined();
    });
});

describe("Is Runnable Code", () => {
    test("Container SetUp", async () => {
        await expect(container.checkCanRun()).resolves.toBeUndefined();
    });
});

describe("Test Plugin Logger", () => {
    test("New Bind Logger", async () => {
        container.container.unbind(ContainerName.Logger);
        decorate(injectable(), NullLogger);

        container.bind(ContainerName.Logger)
            .to(NullLogger)
            .inSingletonScope();

        await expect(container.loadLoggerPlugins()).resolves.toBeUndefined();
    });
});
