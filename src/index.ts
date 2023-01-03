import "reflect-metadata";

import { type LoggerInterface } from "@odg/log";

import Container from "./app/Container";
import { ContainerName } from "./app/Enums";
import { type EventServiceProvider } from "./app/Provider/EventServiceProvider";
import { type ExampleCrawlerService } from "./app/Services/ExampleCrawlerService";
import { type EventTypes } from "./Interfaces/EventsInterface";

const project = new Container();

process.on("uncaughtException", (error) => {
    project.container.get<LoggerInterface | undefined>(ContainerName.Logger)?.emergency(error)
        .finally(() => process.exit(1));
});

(async (): Promise<void> => {
    const { container } = project;

    await project.setUp();

    const eventProvider = container.get<EventServiceProvider<EventTypes>>(ContainerName.EventServiceProvider);
    await eventProvider.boot();
    const service = await container.getAsync<ExampleCrawlerService>(ContainerName.ExampleCrawlerService);

    await project.checkCanRun();

    await service.execute();
    await eventProvider.shutdown();
    console.log("Shutdown");
})()
    .then(() => null)
    .catch(async (error) => {
        await project.container.get<LoggerInterface | undefined>(ContainerName.Logger)?.error(error);
    });
