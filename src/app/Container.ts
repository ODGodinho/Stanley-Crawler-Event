import { AxiosMessage } from "@odg/axios";
import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";
import { EventEmitterBus } from "@odg/events";
import { JSONLoggerPlugin } from "@odg/json-log";
import { ConsoleLogger } from "@odg/log";
import {
    Container as ContainerInversify, decorate, injectable, type interfaces,
} from "inversify";

import type { ContainerType } from "#types/ContainerInterface";
import type { EventTypes } from "#types/EventsInterface";
import { ContainerName } from "@enums";
import type { PageOrHandlerFactoryType } from "@factory/PageFactory";
import { GoogleSearchToSelectionHandler } from "@handlers/GoogleSearch/GoogleSearchHandler";
import type { BasePageInterface } from "@interfaces/BasePageInterface";
import { SearchEventListener } from "@listeners/SearchEventListener";
import { SearchPage } from "@pages/Google/SearchPage";
import { EventServiceProvider } from "@providers/EventServiceProvider";
import { ExampleCrawlerService } from "@services/ExampleCrawlerService";

import { Browser, Context, Page } from "../Browser";
import Kernel from "../Console/Kernel";
import {
    type BrowserClassEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
    browserEngine,
} from "../engine";

export default class Container {

    public readonly container: ContainerInversify;

    private pageContainerNumber = 0;

    public constructor() {
        this.container = new ContainerInversify({ skipBaseClassChecks: true });
    }

    public async setUp(): Promise<void> {
        await this.prepareInjectable();
        await this.bindStanley();
        await this.bindEventsAndListeners();
        await this.bindCrawler();
        await this.loadLoggerPlugins();
    }

    /**
     * Adapter Injectable class constructor
     *
     * @returns {Promise<void>}
     * @memberof Container
     */
    public async prepareInjectable(): Promise<void> {
        decorate(injectable(), ConsoleLogger);
        decorate(injectable(), EventEmitterBus);
    }

    /**
     * BindStanley method
     */
    public async bindStanley(): Promise<void> {
        // Logger Class
        this.bind(
            ContainerName.Logger,
        ).to(ConsoleLogger).inSingletonScope();

        // Message/Request Axios
        this.bind(
            ContainerName.Requester,
        ).to(AxiosMessage).inSingletonScope();

        // Container instance
        this.bind(
            ContainerName.Container,
        ).toDynamicValue(() => this).inSingletonScope();

        // Example Service
        this.bind(
            ContainerName.ExampleCrawlerService,
        ).to(ExampleCrawlerService).inSingletonScope();

        // Example Service
        this.bind(
            ContainerName.Kernel,
        ).to(Kernel).inSingletonScope();
    }

    public async bindEventsAndListeners(): Promise<void> {
        // EventBus Interface
        this.bind(
            ContainerName.EventBus,
        ).to(EventEmitterBus<EventTypes>).inSingletonScope();

        // SearchGoogle Listeners bind
        this.bind(
            ContainerName.SearchEventListeners,
        ).to(SearchEventListener).inSingletonScope();

        // Event Provider
        this.bind(
            ContainerName.EventServiceProvider,
        ).to(EventServiceProvider).inSingletonScope();
    }

    public async bindCrawler(): Promise<void> {
        // Browser puppeteer/Playwright Instance with Plugins
        this.bind(
            ContainerName.Browser,
        ).toDynamicValue(
            async () => Browser.create<BrowserTypeEngine, BrowserClassEngine, ContextClassEngine, PageClassEngine>(
                browserEngine,
                Browser,
                Context,
                Page,
            ).setUp(),
        ).inSingletonScope();

        // SearchPage Google
        this.bind(ContainerName.SearchPage)
            .toFactory(() => this.instancePageOrHandler<SearchPage>(SearchPage));

        // SearchHandler Google
        this.bind(ContainerName.SearchHandler)
            .toFactory(() => this.instancePageOrHandler<GoogleSearchToSelectionHandler>(
                GoogleSearchToSelectionHandler,
            ));
    }

    /**
     * Load Logger Plugins container
     *
     * @returns {Promise<void>}
     * @memberof Container
     */
    public async loadLoggerPlugins(): Promise<void> {
        const logger = this.get(ContainerName.Logger);
        if (!(logger instanceof ConsoleLogger) && logger) {
            logger.use(new JSONLoggerPlugin(process.env.APP_NAME!));
        }
    }

    public async checkCanRun(): Promise<void> {
        // Example Function
    }

    /**
     * Get Container Item
     *
     * @param {ContainerName} serviceIdentifier ContainerName
     * @returns {ContainerType[ContainerName]}
     * @memberof Container
     */
    public get<Name extends keyof ContainerType>(serviceIdentifier: Name): ContainerType[Name] {
        return this.container.get(serviceIdentifier);
    }

    /**
     * Bind Container Item
     *
     * @param {ContainerName} serviceIdentifier ContainerName
     * @returns {ContainerType[ContainerName]}
     * @memberof Container
     */
    public bind<Name extends keyof ContainerType>(
        serviceIdentifier: Name,
    ): interfaces.BindingToSyntax<ContainerType[Name]> {
        return this.container.bind(serviceIdentifier);
    }

    /**
     * Get Async Container Item
     *
     * @param {ContainerName} serviceIdentifier ContainerName
     * @returns {ContainerType[ContainerName]}
     * @memberof Container
     */
    public async getAsync<Name extends keyof ContainerType>(serviceIdentifier: Name): Promise<ContainerType[Name]> {
        return this.container.getAsync(serviceIdentifier);
    }

    /**
     * Use To instance a page Crawler
     *
     * @private
     * @template {PageInterface} PageType
     * @param {BasePageInterface} BasePagePrepare Page Class instantiable
     * @returns {PageOrHandlerFactoryType<PageType>}
     * @memberof Container
     */
    private instancePageOrHandler<PageType extends HandlerInterface | PageInterface>(
        BasePagePrepare: BasePageInterface,
    ): PageOrHandlerFactoryType<PageType> {
        return (page: PageClassEngine): PageType => {
            const container = `PageOrHandler${this.pageContainerNumber++}`;
            this.container.bind(container).to(BasePagePrepare);
            const value = this.container.get<PageType>(container);
            this.container.unbind(container);
            (value as unknown as { page: unknown }).page = page;

            return value;
        };
    }

}
