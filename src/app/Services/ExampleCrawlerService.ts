import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";

import { MyBrowser } from "../../engine";
import { type EventTypes } from "../../Interfaces/EventsInterface";
import { ContainerName, EventName } from "../Enums";

@injectable()
export class ExampleCrawlerService {

    @inject(ContainerName.Logger)
    protected log!: LoggerInterface;

    @inject(ContainerName.EventBus)
    protected bus!: EventBusInterface<EventTypes>;

    @inject(ContainerName.Browser)
    protected browser!: MyBrowser;

    public async execute(): Promise<void> {
        await this.log.info("Executing example crawler service");
        const context = await this.browser.newContext();
        const page = await context.newPage();
        await this.bus.dispatch(EventName.HomePage, {
            page: page,
        });
    }

}
