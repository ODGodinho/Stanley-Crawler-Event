import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import { type EventTypes } from "#types/EventsInterface";
import { MyBrowser } from "@engine";
import { ContainerName, EventName } from "@enums";

import { type GoogleSearchToSelectionHandler } from "../../Handlers/GoogleSearch/GoogleSearchHandler";
import { PageOrHandlerFactoryType } from "../Factory";

@(fluentProvide(ContainerName.ExampleCrawlerService).inSingletonScope().done())
export class ExampleCrawlerService {

    public constructor(
        @inject(ContainerName.Logger) protected log: LoggerInterface,
        @inject(ContainerName.EventBus) protected bus: EventBusInterface<EventTypes>,
        @inject(ContainerName.Browser) protected browser: MyBrowser,
        @inject(ContainerName.SearchHandlerFactory) protected searchToSelectionHandler: PageOrHandlerFactoryType<
            GoogleSearchToSelectionHandler
        >,
    ) {
    }

    public async execute(): Promise<void> {
        await this.log.info("Executing example crawler service");
        const context = await this.browser.newContext();
        const page = await context.newPage();

        await this.bus.dispatch(EventName.SearchPageEvent, {
            page: page,
        });
        await this.searchToSelectionHandler(page).execute();

        await context.close();
    }

}
