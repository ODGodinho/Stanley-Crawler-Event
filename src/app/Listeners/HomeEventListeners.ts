import { type EventListenerInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";

import { type EventBrowserParameters, type EventTypes } from "../../Interfaces/EventsInterface";
import { BasePage } from "../../Pages/BasePage";
import { type HomePage } from "../../Pages/Google/HomePage";
import { ContainerName, type EventName } from "../Enums";
import { PageFactoryType } from "../Factory/PageFactory";

@injectable()
export class HomeEventListeners implements EventListenerInterface<EventTypes, EventName.HomePage> {

    @inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    @inject(ContainerName.HomePage)
    public readonly homePage!: PageFactoryType<HomePage>;

    public async handler({ page }: EventBrowserParameters): Promise<void> {
        await this.log.debug("HomeEventListeners is sended");
        const myStep = this.homePage(page);
        await BasePage.run(myStep);
    }

}
