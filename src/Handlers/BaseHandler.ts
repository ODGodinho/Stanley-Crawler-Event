import { BaseHandler as BaseHandlerChemical } from "@odg/chemical-x";
import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject } from "inversify";

import { ContainerName } from "../app/Enums";
import { type PageClassEngine, type MyPage } from "../engine";
import { type EventTypes } from "../Interfaces/EventsInterface";
import * as Selectors from "../Selectors";

export abstract class BaseHandler extends BaseHandlerChemical<typeof Selectors, MyPage> {

    @inject(ContainerName.EventBus)
    public readonly bus!: EventBusInterface<EventTypes>;

    @inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    public constructor(
        page: PageClassEngine,
    ) {
        super(page, Selectors);
    }

}
