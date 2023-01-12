import { type EventListenerInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";

import { type EventBrowserParameters, type EventTypes } from "../../Interfaces/EventsInterface";
import { type SearchPage } from "../../Pages/Google/SearchPage";
import { ContainerName, type EventName } from "../Enums";
import { PageOrHandlerFactoryType } from "../Factory/PageFactory";

@injectable()
export class HomeEventListeners implements EventListenerInterface<EventTypes, EventName.SearchPage> {

    @inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    @inject(ContainerName.SearchPage)
    public readonly searchPage!: PageOrHandlerFactoryType<SearchPage>;

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.log.debug("HomeEventListeners is sended");
        const myStep = this.searchPage(page);
        await myStep.execute();
    }

}
