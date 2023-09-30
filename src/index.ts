import "reflect-metadata";
import "dotenv/config";

import { ContainerName } from "@enums";

import Container from "./app/Container";

const project = new Container();

(async (): Promise<void> => {
    await project.setUp();

    const eventProvider = project.get(ContainerName.Kernel);
    await eventProvider.boot();

    await project.get(ContainerName.Logger)?.info("Crawler Start");
    const service = await project.getAsync(ContainerName.ExampleCrawlerService);
    await service.execute();

    await project.get(ContainerName.Logger)?.info("Shutdown");

    const browser = await project.getAsync(ContainerName.Browser);
    await browser.close();
})()
    .then(() => process.exit(0))
    .catch(async (error) => {
        await project.get(ContainerName.Logger)?.error(error);
        process.exit(1);
    });
