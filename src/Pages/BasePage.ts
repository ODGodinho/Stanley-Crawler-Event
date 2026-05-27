import { BasePage as ChemicalBasePage } from "@odg/chemical-x";
import type { LoggerInterface } from "@odg/log";

import { ContainerName } from "../app/Enums/index.js";
import type { MyConfig } from "../Configs/index.js";
import { $inject } from "../ContainerInject.js";
import type { PageClassEngine } from "../engine.js";
import * as Selectors from "../Selectors/index.js";

export abstract class BasePage extends ChemicalBasePage<PageClassEngine> {

    @$inject(ContainerName.Logger)
    public readonly logger!: LoggerInterface;

    @$inject(ContainerName.Config)
    public readonly config!: MyConfig;

    /** ! If use robot without browser remove this line */
    public declare readonly page: PageClassEngine;

    public readonly $$s: typeof Selectors = Selectors;

}
