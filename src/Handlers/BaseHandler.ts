import { BaseHandler as BaseHandlerChemical } from "@odg/chemical-x";
import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject } from "inversify";

import type { EventTypes } from "#types/EventsInterface";
import { ContainerName } from "@enums";
import * as Selectors from "@selectors";

import { type PageClassEngine, type MyPage } from "../engine";

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
