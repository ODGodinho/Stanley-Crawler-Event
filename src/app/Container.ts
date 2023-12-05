import { AxiosMessage } from "@odg/axios";
import { type HandlerInterface, type PageInterface } from "@odg/chemical-x";
import { JsonConfig } from "@odg/config";
import { EventEmitterBus } from "@odg/events";
import { JSONLoggerPlugin } from "@odg/json-log";
import { ConsoleLogger, Logger } from "@odg/log";
import {
    Container as ContainerInversify, decorate, injectable, type interfaces,
} from "inversify";

import { type ContainerNameType, type ContainerType, type EventTypes } from "#types";
import { type ConfigType, configValidator } from "@configs";
import { ConfigName, ContainerName } from "@enums";
import { type PageOrHandlerFactoryType } from "@factory/PageOrHandlerFactory";
import { GoogleSearchToSelectionHandler } from "@handlers/GoogleSearch/GoogleSearchHandler";
import { type BasePageInterface } from "@interfaces/BasePageInterface";
import { SearchEventListener } from "@listeners/SearchEventListener";
import { SearchPage } from "@pages/Google/SearchPage";
import { EventServiceProvider } from "@providers/EventServiceProvider";
import { ExampleCrawlerService } from "@services/ExampleCrawlerService";

import { Browser, Context, Page } from "../Browser";
import { Kernel, ProcessKernel } from "../Console";
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
        await this.bindKernel();
        await this.initBeginKernel();
        await this.bindStanley();
        await this.bindEventsAndListeners();
        await this.bindCrawler();
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
     * Get Container Item Optional
     *
     * @template {ContainerNameType} Name
     * @param {Name} serviceIdentifier containerName
     * @returns {ContainerType[Name] | undefined}
     */
    public getOptional<Name extends ContainerNameType>(serviceIdentifier: Name): ContainerType[Name] | undefined {
        if (!this.isBound(serviceIdentifier)) return;

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
     * Adapter Injectable class constructor
     *
     * @memberof Container
     * @returns {Promise<void>}
     */
    private async prepareInjectable(): Promise<void> {
        decorate(injectable(), Logger);
        decorate(injectable(), ConsoleLogger);
        decorate(injectable(), EventEmitterBus);
    }

    /**
     * Init before all Binders Container
     *
     * @returns {Promise<void>}
     */
    private async initBeginKernel(): Promise<void> {
        await this.get(ContainerName.Kernel).init();
    }

    /**
     * Init all requires class for Kernel
     *
     * @returns {Promise<void>}
     */
    private async bindKernel(): Promise<void> {
        this.bind(
            ContainerName.Config,
        ).toDynamicValue(() => new JsonConfig<ConfigType>(process.env, configValidator)).inSingletonScope();

        this.bind(
            ContainerName.ConsoleLogger,
        ).to(ConsoleLogger).inSingletonScope();

        // Event Provider
        this.bind(
            ContainerName.EventServiceProvider,
        ).to(EventServiceProvider).inSingletonScope();

        // Container instance
        this.bind(
            ContainerName.Container,
        ).toDynamicValue(() => this).inSingletonScope();

        // Kernel Inject Service
        this.bind(
            ContainerName.ProcessKernel,
        ).to(ProcessKernel).inSingletonScope();

        // Kernel Inject Service
        this.bind(
            ContainerName.Kernel,
        ).to(Kernel).inSingletonScope();
    }

    /**
     * BindStanley method
     */
    private async bindStanley(): Promise<void> {
        // Logger Class
        this.bind(
            ContainerName.Logger,
        ).to(Logger).inSingletonScope();

        // Message/Request Axios
        this.bind(
            ContainerName.Requester,
        ).to(AxiosMessage).inSingletonScope();

        // Example Service
        this.bind(
            ContainerName.ExampleCrawlerService,
        ).to(ExampleCrawlerService).inSingletonScope();

        const appName = await this.get(ContainerName.Config).get(ConfigName.APP_NAME);
        this.bind(
            ContainerName.JSONLogger,
        ).toDynamicValue(() => new JSONLoggerPlugin(appName ?? "unknown")).inSingletonScope();
    }

    private async bindEventsAndListeners(): Promise<void> {
        // EventBus Interface
        this.bind(
            ContainerName.EventBus,
        ).to(EventEmitterBus<EventTypes>).inSingletonScope();

        // SearchGoogle Listeners bind
        this.bind(
            ContainerName.SearchEventListeners,
        ).to(SearchEventListener).inSingletonScope();
    }

    private async bindCrawler(): Promise<void> {
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
