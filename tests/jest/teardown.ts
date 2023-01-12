import "reflect-metadata";
import { ContainerName } from "../../src/app/Enums";

import { container } from "./SingletonTest";

export default async function teardown(): Promise<void> {
    const browser = await container.getAsync(ContainerName.Browser);

    await browser.close();
}
