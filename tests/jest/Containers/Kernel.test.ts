import { ContainerName } from "../../../src/app/Enums";
import { container } from "../SingletonTest";

describe("Container Kernel Test", () => {
    test("Kernel setup", async () => {
        const kernel = container.get(ContainerName.Kernel);

        await expect(kernel.setUp()).resolves.toBeUndefined();
    });
});
