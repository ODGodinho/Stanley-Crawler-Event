import { ContainerName } from "../../../src/app/Enums/index.js";
import * as Engine from "../../../src/engine.js";
import * as BasePageInterface from "../../../src/Interfaces/index.js";
import { container } from "../SingletonTest.js";

const dynamics = [
    ContainerName.Container,
    ContainerName.BrowserManager,
];

describe.each(dynamics)("Container Dynamic Value Get", (containerName: ContainerName) => {
    test(`Container Dynamic get ${containerName}`, async () => {
        await expect(container.getAsync(containerName)).resolves.toBeDefined();
    });

    test("Test Not Empty", async () => {
        expect(BasePageInterface).toBeDefined();
        expect(Engine).toBeDefined();
    });
});
