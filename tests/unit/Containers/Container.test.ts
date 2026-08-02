import { chromium } from "playwright";
import {
    afterAll,
    beforeAll,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import { ContainerName } from "#enums";
import { ExampleCrawlerService } from "#services";

import { container } from "../../setup/container.js";

function bind(): undefined {
    return 1 as unknown as undefined;
}

function browserMock(): Awaited<ReturnType<typeof chromium.launch>> {
    return {
        close: vi.fn(async (): Promise<void> => {
            await Promise.resolve();
        }),
    } as unknown as Awaited<ReturnType<typeof chromium.launch>>;
}

describe("Container Test", () => {
    test("Container GetAsync", async () => {
        const launchSpy = vi.spyOn(chromium, "launch").mockResolvedValue(browserMock());

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
        launchSpy.mockRestore();
    });

    test("Test isBound", async () => {
        const containerName = "Example" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();

        container.bind(containerName)
            .toDynamicValue(bind)
            .inSingletonScope();

        expect(container.isBound(containerName)).toBeTruthy();
        expect(container.getOptional(containerName)).toBe(1);
    });

    test("Test getOptional bound/not-bound", async () => {
        const containerName = "Example2" as ContainerName;

        expect(container.isBound(containerName)).toBeFalsy();
        expect(container.getOptional(containerName)).toBeUndefined();
        expect(container.getOptional(ContainerName.Logger)).not.toBeUndefined();
    });
});

describe("Container Instances Test", () => {
    beforeAll(async () => {
        vi.spyOn(container.get(ContainerName.Logger), "info").mockResolvedValue();
        vi.spyOn(chromium, "launch").mockResolvedValue(browserMock());

        await container.get(ContainerName.Kernel).boot();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    describe.each(Object.values(ContainerName))("Container Instances Test", (containerName: ContainerName) => {
        test(`ContainerName: ${containerName}`, async () => {
            expect(() => container.get(containerName)).not.toThrow();
        });
    });
});
