import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";

import type { EventTypes } from "../../@types/EventsInterface";
import { MyBrowser } from "../../engine";
import { type GoogleSearchHandler } from "../../Handlers/GoogleSearch/GoogleSearchHandler";
import { ContainerName, EventName } from "../Enums";
import { PageOrHandlerFactoryType } from "../Factory/PageFactory";

@injectable()
export class ExampleCrawlerService {

    @inject(ContainerName.Logger)
    protected log!: LoggerInterface;

    @inject(ContainerName.EventBus)
    protected bus!: EventBusInterface<EventTypes>;

    @inject(ContainerName.Browser)
    protected browser!: MyBrowser;

    @inject(ContainerName.SearchHandler)
    protected searchHandler!: PageOrHandlerFactoryType<GoogleSearchHandler>;

    public async execute(): Promise<void> {
        await this.log.info("Executing example crawler service");
        const context = await this.browser.newContext();
        const page = await context.newPage();
        await this.bus.dispatch(EventName.SearchPage, {
            page: page,
        });

        await this.searchHandler(page).execute();
        await context.close();
        await this.browser.close();
    }

}
