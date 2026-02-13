import {
    type HandlerFunction,
    type HandlerInterface,
    HandlerSolutionType,
    ODGDecorators,
    RetryAction,
} from "@odg/chemical-x";
import type { Exception } from "@odg/exception";

import { ConfigName, ContainerName, EventName } from "@enums";
import { BaseHandler } from "@handlers/BaseHandler";

@ODGDecorators.injectablePageOrHandler(ContainerName.GoogleSearchToSelectionHandler)
export class GoogleSearchToSelectionHandler extends BaseHandler implements HandlerInterface {

    public async waitForHandler(): Promise<HandlerFunction> {
        return Promise.race([
            this.identifySuccessSearch(),
            this.identifyNoResult(),
        ]);
    }

    public async getTimeout(): Promise<number> {
        return this.config.get(ConfigName.HANDLER_TIMEOUT);
    }

    public async attempt(): Promise<number> {
        return this.config.get(ConfigName.HANDLER_ATTEMPT);
    }

    /**
     * Called Always handler attempt error.
     *
     * @param {Exception} exception Exception error
     * @returns {Promise<RetryAction>}
     */
    public async retrying(exception: Exception): Promise<RetryAction> {
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
     * This function identify with page selector if search return or at least One (1) result
     *
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
     * This handler is used to check if the element without results exists in page.
     *
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
     * Action if identifyNoResult resolve in RACE
     *
     * @memberof GoogleSearchToSelectionHandler
     * @returns {Promise<HandlerSolutionType>}
     */
    public async noResultSolution(): Promise<HandlerSolutionType> {
        await this.bus.dispatch(EventName.SearchPageEvent, { page: this.page });

        return RetryAction.Retry;
    }

}
