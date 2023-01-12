import { BasePage as ChemicalBasePage } from "@odg/chemical-x";
import { type LoggerInterface } from "@odg/log";
import { inject, injectable } from "inversify";

import { ContainerName } from "../app/Enums";
import { type PageClassEngine } from "../engine";
import * as Selectors from "../Selectors";

@injectable()
export abstract class BasePage extends ChemicalBasePage<typeof Selectors, PageClassEngine> {

    @inject(ContainerName.Logger)
    public readonly log!: LoggerInterface;

    public constructor(
        page: PageClassEngine,
    ) {
        super(page, Selectors);
    }

}
