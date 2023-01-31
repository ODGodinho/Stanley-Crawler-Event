import "reflect-metadata";

import { type LoggerInterface } from "@odg/log";

import { ContainerName } from "@enums";

import Container from "./app/Container";

const project = new Container();

process.on("uncaughtException", (error) => {
    project.container.get<LoggerInterface | undefined>(ContainerName.Logger)?.emergency(error)
        .finally(() => process.exit(1));
});

(async (): Promise<void> => {
    await project.setUp();

    const eventProvider = project.get(ContainerName.EventServiceProvider);
    await eventProvider.boot();

    await project.checkCanRun();

    const service = await project.getAsync(ContainerName.ExampleCrawlerService);
    await service.execute();

    console.log("Shutdown");
})()
    .then(() => process.exit(0))
    .catch(async (error) => {
        await project.get(ContainerName.Logger)?.error(error);
        process.exit(1);
    });
