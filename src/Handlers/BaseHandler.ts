import { BaseHandler as BaseHandlerChemical } from "@odg/chemical-x";
import { ConfigInterface } from "@odg/config";
import { EventBusInterface } from "@odg/events";
import { LoggerInterface } from "@odg/log";
import { inject } from "inversify";

import { type EventTypes } from "#types/EventsInterface";
import { type ConfigType } from "@configs";
import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import * as Selectors from "@selectors";

export abstract class BaseHandler extends BaseHandlerChemical<typeof Selectors, PageClassEngine> {

    @inject(ContainerName.EventBus)
    public readonly bus!: EventBusInterface<EventTypes>;

    @inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    @inject(ContainerName.Config)
    public readonly config!: ConfigInterface<ConfigType>;

    public constructor(
        page: PageClassEngine,
    ) {
        super(page, Selectors);
    }

}
