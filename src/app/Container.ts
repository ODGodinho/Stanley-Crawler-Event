import { AxiosMessage } from "@odg/axios";
import {
    type CreateContextFactoryType,
    type CreatePageFactoryType,
    BrowserManager,
    type ContextChemicalXInterface,
    ODGDecorators,
} from "@odg/chemical-x";
import { JsonConfig } from "@odg/config";
import { EventEmitterBus } from "@odg/events";
import { JSONLoggerPlugin } from "@odg/json-log";
import { ConsoleLogger, Logger } from "@odg/log";
import { Container as ContainerInversify, type interfaces } from "inversify";
import { buildProviderModule } from "inversify-binding-decorators";

import { type ContainerNameType, type ContainerType, type EventTypes } from "#types";
import { type ConfigType, configValidator } from "@configs";
import { ConfigName, ContainerName } from "@enums";

import { Browser, Context, Page } from "../Browser";
import {
    type BrowserClassEngine,
    type ContextClassEngine,
    type PageClassEngine,
} from "../engine";

import "../Console";
import "@listeners";
import "@handlers";
import "@pages";
import "@providers";
import "@services";

export default class Container {

    public readonly container: ContainerInversify;

    public constructor() {
        this.container = new ContainerInversify({ skipBaseClassChecks: true });
    }

    public async setUp(): Promise<void> {
        this.container.load(buildProviderModule());
        this.container.load(ODGDecorators.loadModule(this.container));
        await this.bindCrawler();
        await this.bindKernel();
        await this.get(ContainerName.Kernel).init();
        await this.bindStanley();
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
        ).toDynamicValue(() => new ConsoleLogger()).inSingletonScope();

        // Logger Class
        this.bind(
            ContainerName.Logger,
        ).toDynamicValue(() => new Logger()).inSingletonScope();

        // Container instance
        this.bind(
            ContainerName.Container,
        ).toDynamicValue(() => this).inSingletonScope();
    }

    /**
     * BindStanley method
     */
    private async bindStanley(): Promise<void> {
        // Message/Request Axios
        this.bind(
            ContainerName.Requester,
        ).to(AxiosMessage).inSingletonScope();

        const appName = await this.get(ContainerName.Config).get(ConfigName.APP_NAME);
        this.bind(
            ContainerName.JSONLogger,
        ).toDynamicValue(() => new JSONLoggerPlugin(appName ?? "unknown")).inSingletonScope();

        // EventBus Interface
        this.bind(
            ContainerName.EventBus,
        ).toDynamicValue(() => new EventEmitterBus<EventTypes>()).inSingletonScope();
    }

    private async bindCrawler(): Promise<void> {
        // Browser puppeteer/Playwright Instance with Plugins
        this.bind(
            ContainerName.BrowserManager,
        ).toConstantValue(new BrowserManager<BrowserClassEngine, ContextClassEngine, PageClassEngine>(
            (
                browserInstance: BrowserClassEngine,
                newContext: CreateContextFactoryType<ContextClassEngine, PageClassEngine>,
                newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
            ) => new Browser(browserInstance, newContext, newPage),
            (
                contextEngine: ContextClassEngine,
                newPage: CreatePageFactoryType<ContextChemicalXInterface<ContextClassEngine>, PageClassEngine>,
            ) => new Context(contextEngine, newPage),
            (
                context: ContextChemicalXInterface<ContextClassEngine>,
                pageEngine: PageClassEngine,
            ) => new Page(context, pageEngine),
        ));
    }

}
