import { BasePage as ChemicalBasePage } from "@odg/chemical-x";
import type { ConfigInterface } from "@odg/config";
import type { LoggerInterface } from "@odg/log";

import type { ConfigType } from "@configs";
import type { PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import * as Selectors from "@selectors";
import { $inject } from "~/ContainerInject";

export abstract class BasePage extends ChemicalBasePage<PageClassEngine> {

    @$inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    @$inject(ContainerName.Config)
    public readonly config!: ConfigInterface<ConfigType>;

    /** ! If use robot without browser remove this line */
    public declare readonly page: PageClassEngine;

    public readonly $$s: typeof Selectors = Selectors;

}
