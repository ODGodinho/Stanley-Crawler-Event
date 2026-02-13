import { provide } from "@inversifyjs/binding-decorators";
import { ODGDecorators } from "@odg/chemical-x";
import type { EventListenerInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { injectable } from "inversify";

import type { EventBrowserParameters, EventTypes } from "#types/EventsInterface";
import { ContainerName, EventName } from "@enums";
import type { SearchPage } from "@pages/Google/SearchPage";
import { $inject } from "~/ContainerInject";

@ODGDecorators.registerListener(EventName.SearchPageEvent, ContainerName.SearchEventListener, {})
@injectable("Singleton")
@provide(ContainerName.SearchEventListener)
export class SearchEventListener implements EventListenerInterface<EventTypes, EventName.SearchPageEvent> {

    public constructor(
        @$inject(ContainerName.Logger) public readonly log: LoggerInterface,
        @$inject(ContainerName.SearchPage) public readonly searchPage: SearchPage,
    ) {
    }

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.log.debug("SearchEventListener is sended");
        await this.searchPage
            .setPage(page)
            .execute();
    }

}
