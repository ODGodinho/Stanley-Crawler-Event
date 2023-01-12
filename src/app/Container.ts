import { AxiosMessage } from "@odg/axios";
import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";

import { ContainerName } from "./Enums/ContainerName";

import { EventEmitterBus } from "@odg/events";

import { type PageOrHandlerFactoryType } from "./Factory/PageFactory";

import { ConsoleLogger } from "@odg/log";

import { HomeEventListeners } from "./Listeners/HomeEventListeners";

import {
    Container as ContainerInversify, decorate, injectable, type interfaces,
} from "inversify";

import { EventServiceProvider } from "./Provider/EventServiceProvider";
import { ExampleCrawlerService } from "./Services/ExampleCrawlerService";

import { Browser, Context, Page } from "../Browser";
import Kernel from "../Console/Kernel";
import {
    type BrowserClassEngine,
    type BrowserTypeEngine,
    type ContextClassEngine,
    type PageClassEngine,
    browserEngine,
} from "../engine";
import { GoogleSearchHandler } from "../Handlers/GoogleSearch/GoogleSearchHandler";
import { type BasePageInterface } from "../Interfaces/BasePageInterface";
import { type ContainerType } from "../Interfaces/ContainerInterface";
import { type EventTypes } from "../Interfaces/EventsInterface";
import { SearchPage } from "../Pages/Google/SearchPage";

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

        // HomeGoogle Listeners bind
        this.bind(
            ContainerName.HomeEventListeners,
        ).to(HomeEventListeners).inSingletonScope();

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
            .toFactory(() => this.instancePageOrHandler<GoogleSearchHandler>(GoogleSearchHandler));
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
