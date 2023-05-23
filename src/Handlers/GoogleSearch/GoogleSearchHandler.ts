import {
    type HandlerInterface, type HandlerFunction, HandlerSolution, RetryAction,
} from "@odg/chemical-x";
import { type Exception } from "@odg/exception";
import { injectable } from "inversify";

import { EventName } from "@enums";
import { BaseHandler } from "@handlers/BaseHandler";

@injectable()
export class GoogleSearchToSelectionHandler extends BaseHandler implements HandlerInterface {

    public async waitForHandler(): Promise<HandlerFunction> {
        return Promise.race([
            this.identifySuccessSearch(),
            this.identifyNoResult(),
        ]);
    }

    public async getTimeout(): Promise<number> {
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
    public async failedAttempt(exception: Exception): Promise<RetryAction> {
        await this.log.warning(exception.message);
        await this.bus.dispatch(EventName.SearchPageEvent, { page: this.page });

        return RetryAction.Default;
    }

    /**
     * Handler finish with success after all attempts
     *
     * @memberof GoogleSearchToSelectionHandler
     * @returns {Promise<void>}
     */
    public async success(): Promise<void> {
        const result = this.page.locator(this.$$s.googleListSelector.results.resultTitles).first();
        const resultText = await result.textContent() ?? "";
        await this.log.alert(`Google search result: ${resultText}`);
    }

    /**
     * @example https://example.print.com/google-search-resullt.png
     *
     * @memberof GoogleSearchToSelectionHandler
     * @returns {Promise<HandlerFunction>}
     */
    public async identifySuccessSearch(): Promise<HandlerFunction> {
        return this.page.locator(this.$$s.googleListSelector.results.resultTitles)
            .first()
            .waitFor({ timeout: await this.getTimeout() })
            .then(() => this.successSolution.bind(this));
    }

    /**
     * @example https://example.print.com/google-search-resullt.png
     *
     * @memberof GoogleSearchToSelectionHandler
     * @returns {Promise<HandlerFunction>}
     */
    public async identifyNoResult(): Promise<HandlerFunction> {
        return this.page.locator(this.$$s.googleListSelector.notResult)
            .waitFor({ timeout: await this.getTimeout() })
            .then(() => this.noResultSolution.bind(this));
    }

    /**
     * Action if not resulta google search
     *
     * @memberof GoogleSearchToSelectionHandler
     * @returns {Promise<HandlerSolution>}
     */
    public async noResultSolution(): Promise<HandlerSolution> {
        await this.bus.dispatch(EventName.SearchPageEvent, { page: this.page });

        return HandlerSolution.Retry;
    }

}
