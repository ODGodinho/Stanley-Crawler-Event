import type { EventTypes } from "#types";
import { BaseHandler as BaseHandlerChemical } from "@odg/chemical-x";
import type { EventBusInterface } from "@odg/events";
import type { LoggerInterface } from "@odg/log";

import { $inject } from "#app/ContainerInject.js";

import { ContainerName } from "../app/Enums/index.js";
import type { MyConfig } from "../Configs/Config.js";
import type { PageClassEngine } from "../engine.js";
import * as Selectors from "../Selectors/index.js";

export abstract class BaseHandler extends BaseHandlerChemical<PageClassEngine> {

    @$inject(ContainerName.EventBus)
    public readonly bus!: EventBusInterface<EventTypes>;

    @$inject(ContainerName.Logger)
    public readonly logger!: LoggerInterface;

    @$inject(ContainerName.Config)
    public readonly config!: MyConfig;

    public readonly $$s: typeof Selectors = Selectors;

    // ! Remove If use API robots
    public declare readonly page: PageClassEngine;

}
