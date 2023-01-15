import { ContainerName } from "../../../src/app/Enums";
import { container } from "../SingletonTest";

const dynamics = [
    ContainerName.Container,
    ContainerName.Browser,
];

describe.each(dynamics)("Container Dynamic Value Get", (containerName: ContainerName) => {
    test(`Container Dynamic get ${containerName}`, async () => {
        await expect(container.getAsync(containerName)).resolves.toBeDefined();
    });
});
