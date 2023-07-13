import { AxiosMessage } from "@odg/axios";
import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";
import { EventEmitterBus } from "@odg/events";
import { JSONLoggerPlugin } from "@odg/json-log";
import { ConsoleLogger } from "@odg/log";
import {
    Container as ContainerInversify, decorate, injectable, type interfaces,
} from "inversify";

import { type ContainerNameType, type ContainerType } from "#types/ContainerInterface";
import { type EventTypes } from "#types/EventsInterface";
import { ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageOrHandlerFactory";
import { GoogleSearchToSelectionHandler } from "@handlers/GoogleSearch/GoogleSearchHandler";
import { type BasePageInterface } from "@interfaces/BasePageInterface";
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
     * @memberof Container
     * @returns {Promise<void>}
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
        this.bind(ContainerName.SearchPageFactory)
            .toFactory(() => this.instancePageOrHandler<SearchPage>(SearchPage));

        // SearchHandler Google
        this.bind(ContainerName.SearchHandlerFactory)
            .toFactory(() => this.instancePageOrHandler<GoogleSearchToSelectionHandler>(
                GoogleSearchToSelectionHandler,
            ));
    }

    /**
     * Load Logger Plugins container
     *
     * @memberof Container
     * @returns {Promise<void>}
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
     * @template {ContainerNameType} Name
     * @param {Name} serviceIdentifier ContainerName
     * @returns {ContainerType[Name]}
     */
    public get<Name extends ContainerNameType>(serviceIdentifier: Name): ContainerType[Name] {
        return this.container.get(serviceIdentifier);
    }

    /**
     * Bind Container Item
     *
     * @template {ContainerNameType} Name
     * @param {Name} serviceIdentifier ContainerName
     * @returns {interfaces.BindingToSyntax<ContainerType[Name]>}
     */
    public bind<Name extends ContainerNameType>(
        serviceIdentifier: Name,
    ): interfaces.BindingToSyntax<ContainerType[Name]> {
        return this.container.bind(serviceIdentifier);
    }

    /**
     * Check if Container Item has bind
     *
     * @template {ContainerNameType} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {boolean}
     */
    public isBound<Name extends ContainerNameType>(
        serviceIdentifier: Name,
    ): boolean {
        return this.container.isBound(serviceIdentifier);
    }

    /**
     * Get Async Container Item
     *
     * @template {ContainerNameType} Name
     * @memberof Container
     * @param {Name} serviceIdentifier ContainerName
     * @returns {Promise<ContainerType[Name]>}
     */
    public async getAsync<Name extends ContainerNameType>(serviceIdentifier: Name): Promise<ContainerType[Name]> {
        return this.container.getAsync(serviceIdentifier);
    }

    /**
     * Use To instance a page and handler Crawler
     *
     * @template {PageInterface} PageType
     * @memberof Container
     * @param {BasePageInterface} BasePagePrepare Page Class instantiable
     * @returns {PageOrHandlerFactoryType<PageType>}
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
