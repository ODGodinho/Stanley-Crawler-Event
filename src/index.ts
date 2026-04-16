import "reflect-metadata";
import type { Logger } from "@odg/log";

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
        await project.getOptional(ContainerName.Logger)?.critical(exception);

        if (
            !project.isBound(ContainerName.Logger)
            || !(project.getOptional(ContainerName.Logger) as Logger).getHandlers().length
            // eslint-disable-next-line no-console -- Only for critical debugger
        ) console.error(exception);
    })
    .finally(async () => {
        await project.get(ContainerName.Kernel).shutdown();
    });
