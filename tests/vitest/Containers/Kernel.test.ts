import { vi } from "vitest";

import { ContainerName } from "@enums";

import { container } from "../SingletonTest";

describe("Container Kernel Test", () => {
    beforeEach(() => {
        const loggerMock = vi.spyOn(container.get(ContainerName.Logger)!, "info");
        loggerMock.mockImplementation(async (): Promise<void> => {
            // Not action
        });
    });

    test("Kernel setup", async () => {
        const kernel = container.get(ContainerName.Kernel);

        await expect(kernel.boot()).resolves.toBeUndefined();
    });

    test("Kernel boot process.send", async () => {
        process.send = (): boolean => true;
        const kernel = container.get(ContainerName.Kernel);

        await expect(kernel.boot()).resolves.toBeUndefined();
    });
});
