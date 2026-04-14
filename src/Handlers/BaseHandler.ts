import { BaseHandler as BaseHandlerChemical } from "@odg/chemical-x";
import type { ConfigInterface } from "@odg/config";
import type { EventBusInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import type { EventTypes } from "#types/EventsInterface";
import type { ConfigType } from "@configs";
import type { PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import * as Selectors from "@selectors";
import { $inject } from "~/ContainerInject";

export abstract class BaseHandler extends BaseHandlerChemical<PageClassEngine> {

    @$inject(ContainerName.EventBus)
    public readonly bus!: EventBusInterface<EventTypes>;

    @$inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    @$inject(ContainerName.Config)
    public readonly config!: ConfigInterface<ConfigType>;

    public readonly $$s = Selectors;

    // ! Remove If use API robots
    public declare readonly page: PageClassEngine;

}
