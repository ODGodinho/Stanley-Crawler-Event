import type { EventTypes } from "#types";
import { ODGDecorators } from "@odg/chemical-x";
import type { EventBusInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import { $inject } from "#app/ContainerInject.js";
import type { MyConfig } from "#configs";
import type { BrowserClassEngine } from "#engine";
import { ConfigName, ContainerName, EventName } from "#enums";
import type { GoogleSearchToSelectionHandler } from "#handlers";

@ODGDecorators.injectable(ContainerName.ExampleCrawlerService, "Singleton")
export class ExampleCrawlerService {

    public constructor(
        @$inject(ContainerName.Logger) protected logger: LoggerInterface,
        @$inject(ContainerName.EventBus) protected bus: EventBusInterface<EventTypes>,
        @$inject(ContainerName.Browser) protected browser: BrowserClassEngine,
        @$inject(ContainerName.Config) protected config: MyConfig,
        @$inject(ContainerName.GoogleSearchToSelectionHandler)
        protected searchToSelectionHandler: GoogleSearchToSelectionHandler,
    ) {
    }

    public async execute(): Promise<void> {
        await this.logger.info("Executing example crawler service");
        const context = this.browser.contexts()[0] ?? await this.browser.newContext();
        const page = context.pages()[0] ?? await context.newPage();

        await this.bus.dispatch(EventName.SearchEvent, {
            page,
        });
        await this.searchToSelectionHandler
            .setPage(page)
            .execute();

        if (!await this.config.get(ConfigName.BROWSER_CDP_URL)) {
            await context.close();
        }
    }

}
