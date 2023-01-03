import { type PageInterface, RetryAction } from "@odg/chemical-x";
import { type Exception } from "@odg/exception";
import { injectable } from "inversify";

import {
    type GoogleHomeSelectorsType,
    googleHomeSelectors,
} from "../../Selectors";
import { BasePage } from "../BasePage";

@injectable()
export class HomePage extends BasePage implements PageInterface {

    public $s: GoogleHomeSelectorsType = googleHomeSelectors;

    public async execute(): Promise<void> {
        await this.preStart();
        await this.page.goto("https://google.com", { timeout: 1 });
    }

    public async success(): Promise<void> {
        await super.success();
    }

    public async finish(exception?: Exception | undefined): Promise<void> {
        if (exception) await this.log.debug(exception);
    }

    public async failed(_exception: Exception): Promise<RetryAction> {
        return RetryAction.Default;
    }

    public async attempt(): Promise<number> {
        return 1;
    }

}
