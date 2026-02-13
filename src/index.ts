import "reflect-metadata";

import { ContainerName } from "@enums";

import { Container } from "./app/Container";

const project = new Container();

(async (): Promise<void> => {
    await project.setUp();
    await project.get(ContainerName.Kernel).boot();

    await project.get(ContainerName.Logger).info("Crawler Start");
    const service = await project.getAsync(ContainerName.ExampleCrawlerService);

    await service.execute();

    await project.get(ContainerName.Logger).info("Shutdown");
})()
    .catch(async (exception) => {
        const loggerName = project.isBound(ContainerName.Logger) ? ContainerName.Logger : ContainerName.ConsoleLogger;

        await project.getOptional(loggerName)?.error(exception);

        // Only critical debugger
        // eslint-disable-next-line no-console
        if (!project.isBound(loggerName)) console.error(exception);
    })
    .finally(async () => {
        await project.get(ContainerName.Kernel).shutdown();
    });
