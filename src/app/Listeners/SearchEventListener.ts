import { type EventListenerInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject } from "inversify";
import { fluentProvide } from "inversify-binding-decorators";

import { type EventBrowserParameters, type EventTypes } from "#types/EventsInterface";
import { ContainerName, type EventName } from "@enums";
import { PageOrHandlerFactoryType } from "@factory";
import { type SearchPage } from "@pages/Google/SearchPage";

@(fluentProvide(ContainerName.SearchEventListeners).inSingletonScope().done())
export class SearchEventListener implements EventListenerInterface<EventTypes, EventName.SearchPageEvent> {

    public constructor(
        @inject(ContainerName.Logger) public readonly log: LoggerInterface,
        @inject(ContainerName.SearchPageFactory) public readonly searchPage: PageOrHandlerFactoryType<SearchPage>,
    ) {
    }

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.log.debug("SearchEventListeners is sended");
        const myStep = this.searchPage(page);
        await myStep.execute();
    }

}
