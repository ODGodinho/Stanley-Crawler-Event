import { BasePage as ChemicalBasePage, retry, type PageInterface } from "@odg/chemical-x";
import { type Exception } from "@odg/exception";
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

    public static async run(pageInstance: PageInterface): Promise<void> {
        return retry(
            {
                times: await pageInstance.attempt() - 1,
                sleep: 0,
                callback: async () => pageInstance.execute(),
                when: async (exception: Exception) => pageInstance.failed(exception),
            },
        ).then(async () => {
            await pageInstance.success();

            return pageInstance.finish?.();
        }).catch(async (exception: Exception) => pageInstance.finish?.(exception));
    }

}
