import { ODGDecorators } from "@odg/chemical-x";
import type { EventListenerInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import type { EventBrowserParameters, EventTypes } from "#types/EventsInterface";
import { ContainerName, EventName } from "@enums";
import type { SearchPage } from "@pages/Google/SearchPage";
import { $inject } from "~/ContainerInject";

@ODGDecorators.injectable(ContainerName.SearchEventListener, "Singleton")
@ODGDecorators.registerListener(EventName.SearchEvent, ContainerName.SearchEventListener, {})
export class SearchEventListener implements EventListenerInterface<EventTypes, EventName.SearchEvent> {

    public constructor(
        @$inject(ContainerName.Logger) public readonly logger: LoggerInterface,
        @$inject(ContainerName.SearchPage) public readonly searchPage: SearchPage,
    ) {
    }

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.logger.debug("SearchEventListener dispatched");
        await this.searchPage
            .setPage(page)
            .execute();
    }

}
