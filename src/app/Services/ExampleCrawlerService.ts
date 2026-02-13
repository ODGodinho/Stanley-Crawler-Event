import { provide } from "@inversifyjs/binding-decorators";
import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { injectable } from "inversify";

import type { EventTypes } from "#types/EventsInterface";
import { BrowserClassEngine } from "@engine";
import { ContainerName, EventName } from "@enums";
import { $inject } from "~/ContainerInject";

import type { GoogleSearchToSelectionHandler } from "../../Handlers/GoogleSearch/GoogleSearchHandler";

@injectable("Singleton")
@provide(ContainerName.ExampleCrawlerService)
export class ExampleCrawlerService {

    public constructor(
        @$inject(ContainerName.Logger) protected log: LoggerInterface,
        @$inject(ContainerName.EventBus) protected bus: EventBusInterface<EventTypes>,
        @$inject(ContainerName.Browser) protected browser: BrowserClassEngine,
        @$inject(ContainerName.GoogleSearchToSelectionHandler)
        protected searchToSelectionHandler: GoogleSearchToSelectionHandler,
    ) {
    }

    public async execute(): Promise<void> {
        await this.log.info("Executing example crawler service");
        const context = await this.browser.newContext();
        const page = await context.newPage();

        await this.bus.dispatch(EventName.SearchPageEvent, {
            page,
        });
        await this.searchToSelectionHandler
            .setPage(page)
            .execute();

        await context.close();
    }

}
