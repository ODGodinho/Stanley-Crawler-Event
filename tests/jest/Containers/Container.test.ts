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
