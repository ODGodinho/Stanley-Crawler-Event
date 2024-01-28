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

    const browser = project.getOptional(ContainerName.Browser);
    await browser?.close();
})()
    .then(() => process.exit(0))
    .catch(async (exception) => {
        const loggerName = project.isBound(ContainerName.Logger) ? ContainerName.Logger : ContainerName.ConsoleLogger;
        await project.getOptional(loggerName)?.error(exception);

        if (!project.isBound(loggerName)) console.error(exception);

        process.exit(1);
    });
