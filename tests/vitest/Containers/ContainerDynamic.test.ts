import * as Engine from "@engine";
import { ContainerName } from "@enums";
import * as Factory from "@factory";
import * as BasePageInterface from "@interfaces";

import { container } from "../SingletonTest";

const dynamics = [
    ContainerName.Container,
    ContainerName.BrowserManager,
];

describe.each(dynamics)("Container Dynamic Value Get", (containerName: ContainerName) => {
    test(`Container Dynamic get ${containerName}`, async () => {
        await expect(container.getAsync(containerName)).resolves.toBeDefined();
    });

    test("Test Not Empty", async () => {
        expect(Factory).toBeDefined();
        expect(BasePageInterface).toBeDefined();
        expect(Engine).toBeDefined();
    });
});
