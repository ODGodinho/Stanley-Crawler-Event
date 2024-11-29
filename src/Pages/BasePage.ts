import { BasePage as ChemicalBasePage } from "@odg/chemical-x";
import { ConfigInterface } from "@odg/config";
import { type LoggerInterface } from "@odg/log";
import { inject } from "inversify";

import { type ConfigType } from "@configs";
import { type PageClassEngine } from "@engine";
import { ContainerName } from "@enums";
import * as Selectors from "@selectors";

export abstract class BasePage extends ChemicalBasePage<typeof Selectors, PageClassEngine> {

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
