import {
    type HandlerInterface, type HandlerFunction, HandlerSolution, RetryAction,
} from "@odg/chemical-x";
import { type Exception } from "@odg/exception";
import { injectable } from "inversify";

import { EventName } from "../../app/Enums";
import { BaseHandler } from "../BaseHandler";

@injectable()
export class GoogleSearchHandler extends BaseHandler implements HandlerInterface {

    public async waitForHandler(): Promise<HandlerFunction> {
        return Promise.race([
            this.identifySuccessSearch(),
            this.identifyNoResult(),
        ]);
    }

    public async timeout(): Promise<number> {
        // Only For Example Correct use env or config library
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return 5000;
    }

    public async attempt(): Promise<number> {
        // Only For Example Correct use env or config library
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        return 5;
    }

    /**
     * Called Always handler attempt error.
     *
     * @param {Exception} exception Exception error
     * @returns {Promise<RetryAction>}
     */
    public async failedWait(exception: Exception): Promise<RetryAction> {
        await this.log.warning(exception.message);
        await this.bus.dispatch(EventName.SearchPage, { page: this.page });

        return RetryAction.Default;
    }

    /**
     * Handler finish with success after all attempts
     *
     * @returns {Promise<void>}
     * @memberof GoogleSearchHandler
     */
    public async success(): Promise<void> {
        const result = this.page.locator(this.$$s.googleListSelectors.results.resultTitles).first();
        const resultText = await result.textContent() ?? "";
        await this.log.alert(`Google search result: ${resultText}`);
    }

    /**
     *
     * @example https://example.print.com/google-search-resullt.png
     *
     * @returns {Promise<HandlerFunction>}
     * @memberof GoogleSearchHandler
     */
    public async identifySuccessSearch(): Promise<HandlerFunction> {
        return this.page.waitForSelector(
            this.$$s.googleListSelectors.results.resultTitles,
            { timeout: await this.timeout() },
        ).then(() => this.successSolution.bind(this));
    }

    /**
     *
     * @example https://example.print.com/google-search-resullt.png
     *
     * @returns {Promise<HandlerFunction>}
     * @memberof GoogleSearchHandler
     */
    public async identifyNoResult(): Promise<HandlerFunction> {
        return this.page.waitForSelector(
            this.$$s.googleListSelectors.notResult,
            { timeout: await this.timeout() },
        ).then(() => this.noResultSolution.bind(this));
    }

    /**
     * Action if not resulta google search
     *
     * @returns {Promise<HandlerSolution>}
     * @memberof GoogleSearchHandler
     */
    public async noResultSolution(): Promise<HandlerSolution> {
        await this.bus.dispatch(EventName.SearchPage, { page: this.page });

        return HandlerSolution.Retry;
    }

}
