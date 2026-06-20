import { chromium } from "playwright";
import {
    afterEach,
    beforeEach,
    describe,
    expect,
    test,
    vi,
} from "vitest";

import { Container } from "#app/Container.js";
import { ConfigName, ContainerName } from "#enums";

describe("Container Kernel Test", () => {
    let container: Container;

    beforeEach(async () => {
        container = new Container();
        await container.setUp();

        const loggerMock = vi.spyOn(container.get(ContainerName.Logger), "info");

        loggerMock.mockImplementation(async (): Promise<void> => {
            // Not action
        });

        vi.spyOn(chromium, "launch").mockResolvedValue({
            close: vi.fn(async (): Promise<void> => {
                await Promise.resolve();
            }),
        } as unknown as Awaited<ReturnType<typeof chromium.launch>>);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test("Kernel setup and shutdown", async () => {
        const kernel = container.get(ContainerName.Kernel);

        await expect(kernel.boot()).resolves.toBeUndefined();
        await expect(kernel.shutdown()).resolves.toBeUndefined();
    });

    test("Kernel boot process.send", async () => {
        process.send = (): boolean => true;
        const kernel = container.get(ContainerName.Kernel);

        await expect(kernel.boot()).resolves.toBeUndefined();
    });

    test("Kernel bootBrowser uses connectOverCDP when browser connect is configured", async () => {
        const kernel = container.get(ContainerName.Kernel);
        const config = container.get(ContainerName.Config);
        const browserConnectUrl = "ws://127.0.0.1:9222/devtools/browser/mock";
        const browserMock: Partial<Awaited<ReturnType<typeof chromium.connectOverCDP>>> = {
            close: vi.fn(async (): Promise<void> => {
                await Promise.resolve();
            }),
        };

        const configGetMock = vi.spyOn(config, "get")
            .mockResolvedValueOnce(browserConnectUrl)
            .mockResolvedValueOnce(true);
        const connectOverCDPMock = vi.spyOn(chromium, "connectOverCDP").mockResolvedValue(
            browserMock as Awaited<ReturnType<typeof chromium.connectOverCDP>>,
        );
        const launchMock = vi.spyOn(chromium, "launch");

        launchMock.mockClear();

        await kernel["bootBrowser"]();

        expect(configGetMock).toHaveBeenCalledWith(ConfigName.BROWSER_CONNECT);
        expect(connectOverCDPMock).toHaveBeenCalledOnce();
        expect(connectOverCDPMock).toHaveBeenCalledWith(
            browserConnectUrl,
            expect.objectContaining({
                args: [ "--no-zygote" ],
                headless: true,
            }),
        );
        expect(launchMock).not.toHaveBeenCalled();
        expect(container.isBound(ContainerName.Browser)).toBeTruthy();
    });
});
