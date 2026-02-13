import { buildProviderModule } from "@inversifyjs/binding-decorators";
import { AxiosMessage } from "@odg/axios";
import {
    BrowserManager,
    type ContextChemicalXInterface,
    type CreateContextFactoryType,
    type CreatePageFactoryType,
    ODGDecorators,
} from "@odg/chemical-x";
import { Container as ContainerBase } from "@odg/chemical-x/container";
import { JsonConfig } from "@odg/config";
import { EventEmitterBus } from "@odg/events";
import { JSONLoggerPlugin } from "@odg/json-log";
import { ConsoleLogger, Logger } from "@odg/log";

import type {
    ContainerInterface,
    EventTypes,
} from "#types";
import { type ConfigType, configValidator } from "@configs";
import { ConfigName, ContainerName } from "@enums";

import { Browser, Context, Page } from "../Browser";
import type {
    BrowserClassEngine,
    ContextClassEngine,
    PageClassEngine,
} from "../engine";

import "@handlers";
import "@listeners";
import "@pages";
import "@providers";
import "@services";
import "../Console";

export class Container extends ContainerBase<ContainerInterface> {

    public async setUp(): Promise<void> {
        await this.bindKernel();
        await this.load(buildProviderModule());
        await this.load(ODGDecorators.loadModule(this));
        await this.bindCrawler();
        await this.get(ContainerName.Kernel).init();
        await this.bindStanley();
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
        ).toDynamicValue(() => new AxiosMessage()).inSingletonScope();

        const appName = await this.get(ContainerName.Config).get(ConfigName.APP_NAME);

        this.bind(
            ContainerName.JSONLogger,
        ).toDynamicValue(() => new JSONLoggerPlugin(appName ?? "unknown")).inSingletonScope();

        // EventBus Interface
        this.bind(
            ContainerName.EventBus,
        ).toDynamicValue(() => new EventEmitterBus<EventTypes>()).inSingletonScope();
    }

    // ! Remove if use API crawlers without browser
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
